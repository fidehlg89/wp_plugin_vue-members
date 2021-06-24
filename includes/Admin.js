(function() {
    const mediaEndpoint = "/sites/fsaltda.com/wp-json/wp/v2/media";
    var vm = new Vue({
        el: document.querySelector('#app-admin'),
        template: //html
            `
            <div>
                <div class="container" v-if="isAdding!=true">
                    <h3 class="wp-heading-inline">Listado de miembros:</h3>
                    <!--button class="button" @click="update">Update List</button-->
                    <button class="button" @click="isAdding=true">Add new</button>
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
                            <div>
                                <img :src="file" style="height:40px; width:40px;"/>
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
            posts: [],
            file: {}
        },
        mounted() {
            this.getToken();
            this.update();
        },
        methods: {
            async getToken() {
                var url = '/sites/fsaltda.com/wp-json/jwt-auth/v1/token';
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
            async fetchData() {
                try {
                    var { data } = await axios.get(mediaEndpoint);
                    this.members = [];
                    data.forEach(element => {
                        let item = {}
                        item.id = element.id;
                        item.name = this.limpiar(element.title.rendered);
                        item.shortdesc = this.limpiar(element.caption.rendered);
                        item.resume = this.limpiar(element.description.rendered);
                        this.members.push(item);
                    });
                } catch (error) {
                    alert(error);
                }
            },
            async deleteItem(item) {
                try {
                    var response = await axios.delete('/sites/fsaltda.com/wp-json/wp/v2/media/' + item.id + '?force=true', {
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
                let reader = new FileReader();

                this.member.image = file;

                reader.onloadend = (file) => {
                    //console.log('RESULT', reader.result)
                    this.file = reader.result;
                }
                reader.readAsDataURL(file);
                console.log(reader.readAsDataURL(file));
            },
            limpiar(value) {
                return value.replace(/<\/?[^>]+(>|$)/g, "")
            },
            replace(value) {
                return value.replace("&#8211;", "-")
            },
            update() {
                this.fetchData();
            }
        },
    });
})();