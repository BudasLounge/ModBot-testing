module.exports ={
    name: 'status',
    description: 'Finds the status of a minecraft server',
    syntax: 'status [name of server]',
    num_args: 1,
    args_to_lower: true,
    needs_api: true,
    has_state: false,
    async execute(message, args, extra){
        var api = extra.api;
        const { EmbedBuilder } = require('discord.js');
        const {getStatus} = require("mc-server-status");
        var respServer;
        try{
            respServer = await api.get("minecraft_server", {
                short_name: args[1]
            });
        } catch(error){
            this.logger.error(error);
        } 
        this.logger.info(respServer);
        if(respServer.minecraft_servers[0]){
            var item;
            var flag = false;
            const ListEmbed = new EmbedBuilder()
            .setColor("#f92f03")
            .setTitle(respServer.minecraft_servers[0].display_name + " status: ");
            ListEmbed.addFields({ name: "Notice:", value: "If the server crashed, it should auto restart in 5 minutes or less\nContact a server admin if it does not." });
            try{
                item = await getStatus(respServer.minecraft_servers[0].server_ip);
            }catch(status_error){
                this.logger.error(status_error);
                item = respServer.minecraft_servers[0].display_name + " is currently offline!";
                ListEmbed.addFields({ name: "status: ", value: item });
                message.channel.send({ embeds: [ListEmbed] });
                flag = true;
            }
            this.logger.info(item);
            if(flag == false){
                var output = respServer.minecraft_servers[0].display_name + " is currently online with: " + item.players.online + " players online!\n";
                output += "Players online:\n";
                if (item.players.sample) {
                    for(var i = 0;i<item.players.online;i++){
                        if (item.players.sample[i]) {
                            output += "- " + item.players.sample[i].name + "\n";
                        }
                    }
                }
                ListEmbed.addFields({ name: "status: ", value: output });
                message.channel.send({ embeds: [ListEmbed] });
            }
        }else{
            message.channel.send("Sorry, couldn't find a server with that shortname, try /listmc for a list of all servers.");
        }
    }
};