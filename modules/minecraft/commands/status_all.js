module.exports ={
    name: 'statusall',
    description: 'Shows all servers and their information',
    syntax: 'statusall',
    num_args: 0,
    args_to_lower: false,
    needs_api: true,
    has_state: false,
    async execute(message, args, extra) {
        var api = extra.api;
        const { EmbedBuilder } = require('discord.js');
        const {getStatus} = require("mc-server-status");
        this.logger.info(">>display_all_servers_status");
        message.channel.send({ content: "Finding info on all servers...\nIf your server is offline, wait up to 5 minutes for it to automatically restart!" });
        var respServer;
        try{
            respServer = await api.get("minecraft_server", {
                _limit: 20
            });
        } catch(error){
            this.logger.error(error.response);
        }
        if(!respServer.minecraft_servers[0]){
            return;
        }
        this.logger.info(respServer.minecraft_servers.length + " servers found...");
        var stat_server = ""; 
        const ListEmbed = new EmbedBuilder()
        .setColor("#f92f03")
        .setTitle("List of all minecraft servers: ");
        ListEmbed.addFields({ name: "Notice:", value: "If the server crashed, it should auto restart in 5 minutes or less\nContact a server admin if it does not." });
        for(var i = 0;i<respServer.minecraft_servers.length;i++){
            this.logger.info("Working on server: " + respServer.minecraft_servers[i].display_name);
            var item;
            var flag = false;
            try{
                item = await getStatus(respServer.minecraft_servers[i].server_ip);
            }catch(status_error){
                this.logger.error(status_error + ", setting flag to true");
                item = respServer.minecraft_servers[i].display_name + " is currently offline!\n\n";
                flag = true;
            }
            if(flag == true){
                this.logger.info("Adding listEmbed for offline server");
                ListEmbed.addFields({ name: respServer.minecraft_servers[i].display_name + " server info:", value: item });
                stat_server += respServer.minecraft_servers[i].display_name + " server info: " + respServer.minecraft_servers[i].display_name + " is currently offline!\n\n";
            }else{
                this.logger.info("Adding listEmbed for online server");
                if(item.players.online>0){
                    var nextItem = respServer.minecraft_servers[i].display_name + " is currently online with: " + item.players.online + " players online!\n";
                    nextItem += "Players online:\n";
                    if (item.players.sample) {
                        for(var j = 0;j<item.players.online;j++){
                            if (item.players.sample[j]) {
                                nextItem += "- " + item.players.sample[j].name + "\n";
                            }
                        }
                    }
                    nextItem += "\n";
                }else{
                    var nextItem = respServer.minecraft_servers[i].display_name + " is currently online but no players are.\n\n";
                }
                ListEmbed.addFields({ name: respServer.minecraft_servers[i].display_name + " server info:", value: nextItem });
                stat_server += nextItem;
            }
        }
        message.channel.send({ embeds: [ListEmbed] });
        //message.channel.send(stat_server);
        this.logger.info("<<display_all_servers_status");
    }
};
