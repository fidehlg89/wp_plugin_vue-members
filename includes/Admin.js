(function() {
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
                                <td>{{item.shortdesc}}</td>
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
                        <div class="container">
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
                                <input id="file" class="regular-text" type="file" v-model="member.profile_url"/>
                            </div>
                            <div class="row">
                                <!--button type="submit" class="button button-primary">{{ loadingText }}</button-->
                                <button type="submit" class="button button-primary">Salvar</button>
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
            posts: []
        },
        mounted() {
            this.getToken();
            this.fetchData();
        },
        methods: {
            async getToken() {
                var url = '/sites/fsaltda.com/wp-json/jwt-auth/v1/token';
                try {
                    var response = await fetch(url, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: "POST",
                        body: JSON.stringify({
                            "username": "adminfsa",
                            "password": "Adminfsa*2021"
                        })
                    });
                    const data = await response.json();
                    this.token = data.token;
                } catch (error) {
                    console.error(error);
                }
            },
            async fetchData() {
                var url = '/sites/fsaltda.com/wp-json/wp/v2/posts';
                try {
                    var response = await fetch(url);
                    const data = await response.json();
                    this.members = [];
                    data.forEach(element => {
                        let item = {}
                        item.id = element.id;
                        item.name = element.title.rendered;
                        item.resume = this.limpiar(element.content.rendered);
                        this.members.push(item);
                    });
                } catch (error) {
                    alert(error);
                }
            },
            async save(e) {
                e.preventDefault();
                console.log(this.token);
                var url = '/sites/fsaltda.com/wp-json/wp/v2/posts';
                try {
                    await fetch(url, {
                        headers: {
                            'Authorization': 'Bearer ' + this.token,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: "POST",
                        body: JSON.stringify({ title: this.member.name, content: this.member.resume, status: 'publish' })
                    });
                    await this.fetchData();
                } catch (error) {
                    alert(error);
                }
            },
            async deleteItem(item) {
                console.log(item);
                var url = `/sites/fsaltda.com/wp-json/wp/v2/posts/${item.id}`;
                try {
                    await fetch(url, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: "DELETE"
                    });
                    this.fetchData();
                } catch (error) {
                    alert(error);
                }
            },
            limpiar(value) {
                return value.replace(/<\/?[^>]+(>|$)/g, "")
            },
            update() {
                this.fetchData();
            }
        },
    });
})();