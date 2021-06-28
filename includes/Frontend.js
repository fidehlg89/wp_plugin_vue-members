(function() {
    const mediaEndpoint = "/wp-json/wp/v2/media";
    var vm = new Vue({
        el: document.querySelector('#app-frontend'),
        template: //html
            `<div>
                <div id="fsa-tm">
                <ul class="fsa-tm-list cols" v-for="(item, index) in members">
                <li key={{index}}>
                    <div class="thumnailbx">
                        <img :src="item.url"/>
                    </div>
                    <div class="titledesbox">
                        <span class="title">{{item.name}}</span>
                        <cite>{{item.shortdesc}}</cite>
                    </div>
                </li>
            </ul>
                </div>
            </div>
            `,
        data: {
            members: [],
        },
        mounted() {
            this.getData();
        },
        methods: {
            async getData() {
                let npage = 1;
                let url = `${mediaEndpoint+'?page='+npage}&per_page=10`;
                let tempdata = [];

                this.members = [];
                try {
                    let { data } = await axios.get(url);
                    tempdata = data;

                    data.forEach(element => {
                        if (element.alt_text == "fsa-vue-members") {
                            let item = [];
                            item.id = element.id;
                            item.name = element.title.rendered;
                            item.shortdesc = this.replace(this.limpiar(element.caption.rendered));
                            item.resume = element.description.rendered;
                            item.url = element.source_url;
                            this.members.push(item);
                        }
                    });
                } catch (error) {
                    alert(error);
                }

                while (tempdata.length > 0) {
                    npage++;
                    let url = `${mediaEndpoint+'?page='+npage}&per_page=10`;
                    try {
                        let { data } = await axios.get(url);
                        data.forEach(element => {
                            if (element.alt_text == "fsa-vue-members") {
                                let item = [];
                                item.id = element.id;
                                item.name = element.title.rendered;
                                item.shortdesc = this.replace(this.limpiar(element.caption.rendered));
                                item.resume = element.description.rendered;
                                item.url = element.source_url;
                                this.members.push(item);
                            }
                        });
                        tempdata = data;
                    } catch {
                        tempdata = [];
                    }
                }
            },
            limpiar(value) {
                return value.replace(/<\/?[^>]+(>|$)/g, "")
            },
            replace(value) {
                return value.replace("&#8211;", "-")
            },
        },
    });
})();