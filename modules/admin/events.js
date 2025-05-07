var ApiClient = require("../../core/js/APIClient.js");
var api = new ApiClient();

async function onUserJoin(member){
	var respServer;
    try{
        respServer = await api.get("discord_server", {
            server_id: member.guild.id
        });
    }catch(error){
        console.log(error);
    }
    if(respServer.discord_servers[0]){
            const channel = member.guild.channels.cache.get(respServer.discord_servers[0].welcome_channel_id);
            if (channel) {
                channel.send("Hi! <@" + member.id + "> "+respServer.discord_servers[0].welcome_message);
            }
            member.roles.add(respServer.discord_servers[0].default_role_id);
    }
}

function register_handlers(event_registry) {
    event_registry.register('guildMemberAdd', onUserJoin);
}

module.exports = register_handlers;
