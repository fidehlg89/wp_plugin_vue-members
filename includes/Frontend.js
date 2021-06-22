(function() {
    const url = '/sites/fsaltda.com/';
    var vm = new Vue({
        el: document.querySelector('#app-frontend'),
        template: //html
            `<div>
                <h1>My Latest Posts</h1>
                    <div>
                        <p class="container" v-for="post in posts">
                            <a v-bind:href="post.link">{{post.title.rendered}}</span></a>
                        </p>
                    </div>
            </div>
            `,
        data: {
            posts: []
        },
        mounted() {
            this.fetchPosts();
            /*setInterval(function() {
                this.fetchPosts();
            }.bind(this), 5000);*/
        },
        methods: {
            async fetchPosts() {
                try {
                    var response = await fetch(url + 'wp-json/wp/v2/posts');
                    const data = await response.json();
                    this.posts = data;
                } catch (error) {
                    console.error(error);
                }

            }
        },
    });
})();