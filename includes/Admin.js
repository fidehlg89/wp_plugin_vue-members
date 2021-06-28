(function() {
    const mediaEndpoint = "/wp-json/wp/v2/media";
    var vm = new Vue({
        el: document.querySelector('#app-admin'),
        template: //html
            `
            <div>
                <div class="wp-container" v-if="isAdding!=true">
                    <h3 class="wp-heading-inline">Listado de miembros:</h3>
                    <!--button class="button" @click="update">Update List</button-->
                    <button class="button" @click="isAdding=true">Add new</button>
                    <br/>
                    <!--p class="container" v-for="post in posts">
                        <a v-bind:href="post.link">{{post.title.rendered}}</span></a>
                    </p-->
                    <table class="wp-list-table widefat fixed striped table-view-list posts">
                        <thead>
                            <tr>
                                <td>Nombre</td>
                                <td>Descripción</td>
                                <td>Resumen</td>
                                <td>Acciones</td>
                            </tr>
                        </thead>
                        <tbody v-for="(item, index) in members">
                            <tr key={index}>
                                <td>{{item.name}}</td>
                                <td>{{replace(item.shortdesc)}}</td>
                                <td>{{item.resume}}</td>
                                <td>
                                    <span class="edit">
                                        <!--button class="button-link editinline">Editar</button-->
                                        <!--span style="margin-right:10px;"> </span-->
                                        <button class="button-link editinline" @click="deleteItem(item)">Eliminar</button>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="container" v-if="isAdding">
                    <br/>
                    <button class="button" @click="isAdding=false" label="Add new member">Go to the List</button>
                    <h3>{{action_text}} miembro:</h3>
                    <form id="fsa-team-form" @submit="save">
                        <div class="form-row">
                            <div class="col">
                                <div class="row">
                                    <label for="name">Entre Nombre:</label>
                                    <br/>
                                    <input id="name" class="regular-text" type="text" v-model="member.name"/>
                                </div>
                                <div class="row">
                                    <label for="shortdesc">Descripción corta:</label>
                                    <br/>
                                    <input id="shortdesc" class="regular-text" type="text" v-model="member.shortdesc"/>
                                </div>
                                <div class="row">
                                    <label for="resume">Descripción larga:</label>
                                    <br/>
                                    <textarea id="resume" class="regular-text" type="text" rows="8" v-model="member.resume"></textarea>
                                </div>
                                <div class="row">
                                    <label for="resume">Imagen:</label>
                                    <br/>
                                    <input type="file" @change='uploadImage' name="photo">
                                </div>
                                <div class="row">
                                    <!--button type="submit" class="button button-primary">{{ loadingText }}</button-->
                                    <button type="submit" class="button button-primary">Salvar</button>
                                </div>
                            </div>
                            <div class="col" style="margin-left: 10%;">
                                <div class="member-image fsa-tm-list thumnailbx"  v-if="file!==null">
                                    <img :src="file" />
                                </div>
                            </div>
                        </div>
                    </form>
                    <div class="clear"></div>
                </div>
            </div>
            `,
        data: {
            isAdding: false,
            action_text: 'Añadir nuevo',
            members: [],
            member: {},
            token: '',
            file: null
        },
        mounted() {
            this.getToken();
            this.update();
        },
        methods: {
            async getToken() {
                var url = '/wp-json/jwt-auth/v1/token';
                try {
                    var { data } = await axios.post(url, {
                        "username": "adminfsa",
                        "password": "Adminfsa*2021"
                    });
                    this.token = data.token;
                } catch (error) {
                    alert(error);
                }
            },
            async getData() {
                let npage = 1;
                let url = `${mediaEndpoint+'?page='+npage}&per_page=10`;
                let { data } = await axios.get(url);
                let tempdata = data;

                this.members = [];
                data.forEach(element => {
                    if (element.alt_text == "fsa-vue-members") {
                        let item = [];
                        item.id = element.id;
                        item.name = this.limpiar(element.title.rendered);
                        item.shortdesc = this.limpiar(element.caption.rendered);
                        item.resume = this.limpiar(element.description.rendered);
                        this.members.push(item);
                    }
                });

                while (tempdata.length > 0) {
                    npage++;
                    let url = `${mediaEndpoint+'?page='+npage}&per_page=10`;
                    try {
                        let { data, status } = await axios.get(url);
                        if (status == 201) {
                            data.forEach(element => {
                                if (element.alt_text == "fsa-vue-members") {
                                    let item = [];
                                    item.id = element.id;
                                    item.name = this.limpiar(element.title.rendered);
                                    item.shortdesc = this.limpiar(element.caption.rendered);
                                    item.resume = this.limpiar(element.description.rendered);
                                    this.members.push(item);
                                }
                            });
                            tempdata = data;
                        }
                    } catch (error) {
                        tempdata = [];
                    }
                }
            },
            async deleteItem(item) {
                try {
                    var response = await axios.delete('/wp-json/wp/v2/media/' + item.id + '?force=true', {
                        headers: {
                            Authorization: "Bearer " + this.token
                        }
                    });
                    console.log(response);
                    this.update();
                } catch (error) {
                    alert(error);
                }
            },
            async save(e) {
                e.preventDefault();
                const formData = new FormData();
                this.member.image ? formData.append("file", this.member.image) : '';
                this.member.name ? formData.append('title', this.member.name) : '';
                this.member.shortdesc ? formData.append('caption', this.member.shortdesc) : '';
                this.member.resume ? formData.append('description', this.member.resume) : '';
                formData.append('alt_text', 'fsa-vue-members');

                //send image to media library
                try {
                    var response = await axios.post(mediaEndpoint, formData, {
                        headers: { Authorization: "Bearer " + this.token }
                    });
                    console.log(response);
                    //var data = await response.json();
                    if (response.status == 201) {
                        await this.update();
                        this.isAdding = false;
                        this.member = {}
                    }
                } catch (error) {
                    alert(error);
                }
            },
            uploadImage(e) {
                let file = e.target.files[0];

                if (!/\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(file.name)) {
                    alert("seleccione una imagen valida");
                } else {
                    let reader = new FileReader();
                    this.member.image = file;
                    reader.onloadend = () => {
                        this.file = reader.result;
                    }
                    reader.readAsDataURL(file);
                }
            },
            limpiar(value) {
                return value.replace(/<\/?[^>]+(>|$)/g, "")
            },
            replace(value) {
                return value.replace("&#8211;", "-")
            },
            update() {
                this.getData();
            },
        },
    });
})();