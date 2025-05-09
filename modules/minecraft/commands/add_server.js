module.exports = {
    name: 'add_server',
    description: 'Used to add a new minecraft server to the database',
    syntax: 'add_server [check code comments]', //[display_name] [short_name] [server_ip] [port] [status_api_port] [numeric_ip] [mc_version] [pack version]
    num_args: 6,
    args_to_lower: true,
    needs_api: true,
    has_state: false,
    async execute(message, args, extra) {
        var api = extra.api;

        console.log(">>add_server");
        if(message.member.roles.has("586313447965327365")){
            var respServer;
            try{
                console.log("in try");
                respServer = await api.get("minecraft_server", {
                    server_ip: args[3]
                });
            } catch(error){
                console.error(error);
            } 
            if(!respServer.minecraft_servers[0]){
                message.channel.send("Adding server " + args[1] + " to the database, here we goooooooo");
                if(!Number.isInteger(args[5])){
                    args[5] = "none";
                }
                try{
                    await api.post("minecraft_server", {
                        display_name: args[1],
                        short_name: args[2],
                        server_ip: args[3],
                        port: args[4],
                        status_api_port: args[5],
                        numeric_ip: args[6],
                        mc_version: args[7],
                        pack_version: args[8]
                    });
                }catch(err){
                    console.error(err);
                    message.channel.send("I hit a snag...");
                }
            }
            else{
                message.channel.send("I found a server with that server_ip already, try again");
            }
            console.log("<<add_server");
        }else{
            message.channel.send("You don't have permission to use that command!");
        }
    }

};
