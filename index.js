// Imports
const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');
const path = require('path');

// Globals
const client = new Client();
const config = require('./config.json');

// Confirm token has been provided in configuration
if (config.token === "" || config.token === undefined) {
    console.log(`No token provided, exiting...`);
    process.exit(0);
}

// This function runs when the bot has successfully been connected to the Discord API using the provided token
client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    /*
        Export state
    */

    // Retreive necessary data from Discord API
    var channels = await fetchChannels();
    var relationships = await fetchRelationships();
    var guilds = await fetchGuilds();

    console.log(`Successfully found ${channels.length} channel(s), ${relationships.length} relationship(s), and ${guilds.length} guild(s).`);

    // Parse data into final format for exported JSON File
    var data = {
        timestamp: new Date().toUTCString(),
        user: client.user.tag,
        userId: client.user.id,
        channels,
        relationships,
        guilds,
    };

    // Write to file
    fs.writeFileSync(path.join(__dirname, 'exports', `export-${client.user.username}${Date.now()}.json`), JSON.stringify(data));

    console.log(`Exported data in JSON format to ${path.join(__dirname, 'exports', `export-${client.user.username}${Date.now()}.json`)}!`);
    process.exit(0);
});


// Helpers
const fetchChannels = async () => {
    var res = await fetch('https://discord.com/api/v10/users/@me/channels', {
        headers: {
            'Authorization': config.token,
        },
    });

    var result = await res.json();
    return result;
}

const fetchRelationships = async () => {
    var res = await fetch('https://discord.com/api/v10/users/@me/relationships', {
        headers: {
            'Authorization': config.token,
        },
    });

    var result = await res.json();
    return result;
}

const fetchGuilds = async () => {
    var res = await fetch('https://discord.com/api/v10/users/@me/guilds', {
        headers: {
            'Authorization': config.token,
        },
    });

    var result = await res.json();
    return result;
}

client.login(config.token);