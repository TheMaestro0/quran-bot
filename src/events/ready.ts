import type { Client } from 'discord.js'
import { createAudioResource, StreamType } from '@discordjs/voice'
import fetch from 'node-fetch'
import config from '../config'
import { Readable } from 'node:stream'


const STREAM_URL = 'https://qurango.net/radio/tarateel'


export const ready = async (client: Client<true>): Promise<void> => {
	console.log('Connected')
	console.log(client.user.tag)


	const promises: Promise<unknown>[] = []
	const commands = [...client.commands.values()]

	for (const guild of client.guilds.cache.values()) {
		promises.push(guild.commands.set(commands))
	}

	await Promise.all(promises)

	const response = await fetch(STREAM_URL)
	const resource = createAudioResource(Readable.from(response.body), { inputType: StreamType.Arbitrary })

	client.radio.play(resource)
}