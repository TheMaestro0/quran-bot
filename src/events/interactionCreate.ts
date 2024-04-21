import type { Interaction } from 'discord.js'
import { GuildMember } from 'discord.js'


export const interactionCreate = async (ctx: Interaction): Promise<void> => {
	if (!ctx.isCommand() || !ctx.inGuild()) return

	const command = ctx.client.commands.get(ctx.commandName)

	if (!command)
		return void ctx.reply({ content: 'Command not exists.', ephemeral: true })

	if (!ctx.member || !(ctx.member instanceof GuildMember)) {
		ctx.member = await ctx.guild!.members.fetch(ctx.user.id)
	}

	const player = ctx.client.getPlayer(ctx.guildId)

	if (command.voice?.joined && !ctx.member.voice.channel) {
		return void ctx.reply({
			content: 'Join voice/stage channel!',
			ephemeral: true
		})
	}

	if (command.voice?.connected) {
		if (ctx.member.voice.channel) {
			if (!player.connected) {
				try {
					await player.connect(ctx.member.voice.channel)
				} catch (e) {
					console.error(e)
					return void ctx.reply({ content: 'Failed to connect...', ephemeral: true })
				}
			}
		} else {
			return void ctx.reply({ content: 'Join voice/stage channel!', ephemeral: true })
		}
	}

	if (command.voice?.playing && !player.playing) {
		return void ctx.reply({
			content: 'Nothing is playing.', 
			ephemeral: true
		})
	}

	try {
		await Promise.resolve(command.run(ctx))
	} catch (error) {
		console.error(error)
	}
}