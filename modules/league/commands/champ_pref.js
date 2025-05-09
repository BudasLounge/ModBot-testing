module.exports = {
    name: 'approve_champ',
    description: 'Approves the champion for your custom champ pool',
    syntax: 'approve_champ [champion name]',
    num_args: 1,
    args_to_lower: true,
    needs_api: true,
    has_state: false,
    async execute(message, args, extra) {
        var api = extra.api;
        
        var respChamps;
        try{
            respChamps = await api.get("league_champion",{
                name: args[1]
            });
        } catch(error){
            this.logger.error(error.response);
        }
        if(respChamps.league_champions[0]){
            this.logger.info("Found a champion");
            try{
                var respUpdate = await api.post("league_pref_champ" , {
                    champ_name: args[1],
                    user_id:message.member.id
                });
                this.logger.info(respUpdate);
                if(respUpdate.ok == true){
                    message.channel.send(respChamps.league_champions[0].name + " is now <@" + message.member.id + "> approved");
                }
            }catch(error2){
                this.logger.error({error: error2.response});
            }
        }else{
            message.channel.send("No champion with that name here!");
        }
    }
};