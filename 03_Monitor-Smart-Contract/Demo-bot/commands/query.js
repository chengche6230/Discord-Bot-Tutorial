const { SlashCommandBuilder } = require('discord.js');

const contractAddress = "0xF10A5F9FEEF5b3C52C7ca71dC11e467B727C7222";
const contractABI = [
	{
		"inputs":[
			{
				"internalType":"uint256",
				"name":"tokenId",
				"type":"uint256"
			}
		],
		"name":"revvingPeriod",
		"outputs":[
			{
				"internalType":"bool",
				"name":"revving",
				"type":"bool"
			},
			{
				"internalType":"uint256",
				"name":"current",
				"type":"uint256"
			},
			{
				"internalType":"uint256",
				"name":"total",
				"type":"uint256"
			}
		],
		"stateMutability":"view",
		"type":"function"
	}
];

require('dotenv').config();

const Web3 = require("web3");
const web3 = new Web3(process.env.ALCHEMY_URL);
const NFT = new web3.eth.Contract(contractABI, contractAddress);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('query')
		.setDescription('Query staking NFT!')
		.addStringOption(option =>
			option.setName('id')
				.setDescription('ID of NFT')
				.setRequired(true)),
	async execute(interaction) {
		var val = parseInt(interaction.options.get('id').value);

        const res = await NFT.methods.revvingPeriod(val).call(function (err, res) {
            if (err) {
                console.log("An error occured", err);
                return;
            }
        });

        const staking = res[0];
		if(staking){
			await interaction.reply('`ID ' + val + ' is staking!`:white_check_mark:');
		}else{
			await interaction.reply('`ID ' + val + " isn't staking!`:x:");
		}

	},
};