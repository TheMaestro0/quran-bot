import { CTX, Command, OAuth2Scopes, PermissionFlagsBits, Permissions } from 'discord.js'

export class InviteCommand implements Command {
	name = 'invite'
	description = 'Invite me to your server!'
	run(ctx: CTX): Promise<unknown> {
		const invite = ctx.client.generateInvite({
			permissions: PermissionFlagsBits.AddReactions | PermissionFlagsBits.UseExternalEmojis | PermissionFlagsBits.ViewChannel | PermissionFlagsBits.Connect | PermissionFlagsBits.Speak,
			scopes: [OAuth2Scopes.ApplicationsCommands]
		})
		return ctx.reply({ content: `[**Click Here!**](<${invite}>)`, ephemeral: true })
	}
}