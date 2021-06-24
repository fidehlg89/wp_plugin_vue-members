(function() {
    const mediaEndpoint = "/sites/fsaltda.com/wp-json/wp/v2/media";
    var vm = new Vue({
        el: document.querySelector('#app-frontend'),
        template: //html
            `<div>
                    <div id="fsa-tm">
                        <ul class="fsa-tm-list cols" v-for="item in members">
                            <li>
                                <div class="thumnailbx">
                                    <img :src="item.source_url"/>
                                </div>
                                <div class="titledesbox">
                                    <span class="title">{{item.title.rendered}}</span>
                                    <cite>{{replace(limpiar(item.caption.rendered))}}</cite>
                                </div>
                            </li>
                        </ul>

                    </div>
            </div>
            `,
        data: {
            members: []
        },
        mounted() {
            this.fetchData();
        },
        methods: {
            async fetchData() {
                try {
                    var { data } = await axios.get(mediaEndpoint);
                    console.log(data);
                    this.members = data;
                    /*data.forEach(element => {
                        let item = {}
                        item.id = element.id;
                        item.name = element.title.rendered;
                        item.shortdesc = this.limpiar(element.caption.rendered);
                        item.resume = this.limpiar(element.description.rendered);
                        this.members.push(item);
                    });*/
                    console.log(members);
                } catch (error) {
                    console.error(error);
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