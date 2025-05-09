module.exports = {
    name: 'delete_server',
    description: 'Used to delete a minecraft server to the database',
    syntax: 'delete_server [short_name or display_name]',
    num_args: 1,
    args_to_lower: true,
    needs_api: true,
    has_state: false,
    async execute(message, args, extra) {
        var api = extra.api;

        var respServer;
        if(message.member.roles.has("586313447965327365") || message.member.roles.has("670379823239004161")){
            try{
                respServer = await api.get("minecraft_server", {
                    short_name: args[1]
                });
            }catch(error){
                console.error(error);
            }
            if(!respServer.minecraft_servers[0]){
                message.channel.send("short_name not found...checking display_name");
                try{
                    respServer = await api.get("minecraft_server", {
                        display_name: args[1]
                    });
                }catch(error2){
                    console.error(error2);
                }
            }
            if(respServer.minecraft_servers[0]){
                var respDelete = await api.delete("minecraft_server", {
                    short_name: respServer.minecraft_servers[0].short_name
                });  
                if(respDelete.ok){
                    message.channel.send(respServer.minecraft_servers[0].display_name + " has been successfully deleted.");
                }
            }else{
                message.channel.send("That server could not be found...");
            }
        }else{
            message.channel.send("You don't have permission to do that");
        }
    }
};