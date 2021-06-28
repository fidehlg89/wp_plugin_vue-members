== Pre-requisites ==
Step 1. Install Wordpress
Step 2. Check permalink and set on post name
Step 3. On plugins section upload and install and activate a plugin named JWT Authentication for WP REST API - https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
Step 4. Open .htaccess and add this lines before </IdModule> ends:
        RewriteCond %{HTTP:Authorization} ^(.*)
        RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
        SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1

==Instalation==
Step 1. Upload zip form vue-fsa-members in plugins section, then activate it
Step 2. Make shure all your request have Authotization header token, you can try with postman to generate your token
Step 3. When you have the token set to requests and all done

