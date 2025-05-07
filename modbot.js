var fs = require('fs');
var axios = require('axios');
var request = require('request');

const { Client, GatewayIntentBits, ActivityType } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

var config = JSON.parse(fs.readFileSync('modbot.json'));

var ModuleHandler = require('./core/js/module_handler.js');
var EventRegistry = require('./core/js/event_registry.js');
var StateManager = require('./core/js/state_manager.js');
var LogHandler = require('./core/js/log_handler.js');

var logger = LogHandler.build_logger(__dirname + "/" + config.log_folder);

var state_manager = new StateManager(logger);

var modules = new ModuleHandler(__dirname, state_manager, logger);
modules.discover_modules(__dirname + "/" + config.modules_folder);
modules.discover_commands();

var event_registry = new EventRegistry(client, logger);
event_registry.discover_event_handlers(modules);

logger.info("Event Registration Complete!");

authClient();

async function botInit () {
    logger.info("I am ready!");

    var channel = await client.channels.fetch(config.default_channel);
    
    if(fs.existsSync("updated.txt")) {
        channel.send({ content: config.startup_messages.update });
        fs.unlinkSync("updated.txt");
    } else {
        channel.send({ content: config.startup_messages.restart });
    }

    const activityTypeString = config.bot_activity.type ? config.bot_activity.type.toUpperCase() : "PLAYING";
    let activityTypeEnumValue = ActivityType.Playing;

    if (activityTypeString === "LISTENING") activityTypeEnumValue = ActivityType.Listening;
    else if (activityTypeString === "WATCHING") activityTypeEnumValue = ActivityType.Watching;
    else if (activityTypeString === "COMPETING") activityTypeEnumValue = ActivityType.Competing;

    client.user.setActivity(config.bot_activity.name, { type: activityTypeEnumValue });
}

client.on('ready', botInit);

function authClient() {
    var token;

    try {
        token = fs.readFileSync(config.token_file).toString();
        token = token.replace(/\s+/g, '');
    } catch (error) {
        logger.error(error);
    }

    client.login(token);
}

client.on('messageCreate', (message) => {
    logger.info("Got message!");
    modules.handle_command(message);
});
