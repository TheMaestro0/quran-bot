import { CTX, Command, EmbedBuilder, ApplicationCommandOptionType } from 'discord.js'
import { getPrayerTimes } from '../utils'

export class PrayerTimesCommand implements Command {
	name = 'prayertimes'
	description = 'Gets prayer times for a specified location.'
	options = [{
		name: 'address',
		type: ApplicationCommandOptionType.String as const,
		description: 'location name',
		required: true
	}, {
		name: 'method',
		type: ApplicationCommandOptionType.Integer as const,
		description: 'A prayer times calculation method. (default: Egyptian General Authority of Survey)',
		required: false,
		choices: [{
			name: 'Shia Ithna-Ansari',
			value: 0
		}, {
			name: 'University of Islamic Sciences, Karachi',
			value: 1
		}, {
			name: 'Islamic Society of North America',
			value: 2
		}, {
			name: 'Muslim World League',
			value: 3
		}, {
			name: 'Umm Al-Qura University, Makkah',
			value: 4
		}, {
			name: 'Egyptian General Authority of Survey',
			value: 5
		}, {
			name: 'Institute of Geophysics, University of Tehran',
			value: 7
		}, {
			name: 'Gulf Region',
			value: 8
		}, {
			name: 'Kuwait',
			value: 9
		}, {
			name: 'Qatar',
			value: 10
		}, {
			name: 'Majlis Ugama Islam Singapura, Singapore',
			value: 11
		}, {
			name: 'Union Organization islamic de France',
			value: 12
		}, {
			name: 'Diyanet İşleri Başkanlığı, Turkey',
			value: 13
		}, {
			name: 'Spiritual Administration of Muslims of Russia',
			value: 14
		}]
	}, {
		name: 'school',
		type: ApplicationCommandOptionType.Integer as const,
		description: 'Shafi or Hanafi (If you leave this empty, it defaults to Shafii.)',
		required: false,
		choices: [{
			name: 'Shafi',
			value: 0
		}, {
			name: 'Hanafi',
			value: 1
		}]
	}]

	async run(ctx: CTX): Promise<unknown> {
		await ctx.deferReply()

		const location = ctx.options.getString('address', true)
		const method = ctx.options.getInteger('method', false) ?? 5
		const school = ctx.options.getInteger('school', false) ?? 0

		const embed = new EmbedBuilder()
			.setAuthor({ name: 'Prayer Times for ' + location })
			.setColor('#2f3136')

		try {
			const {
				fajr,
				sunrise,
				dhuhr,
				asr,
				maghrib,
				isha,
				imsak,
				midnight
			} = await getPrayerTimes(location, method, school)

			const fields = [
				['**Imsak (إِمْسَاك)**', imsak],
				['**Fajr (صلاة الفجر)**', fajr],
				['**Sunrise (طلوع الشمس)**', sunrise],
				['**Ẓuhr (صلاة الظهر)**', dhuhr],
				['**Asr (صلاة العصر)**', asr],
				['**Maghrib (صلاة المغرب)**', maghrib],
				['**Isha (صلاة العشاء)**', isha],
				['**Midnight (منتصف الليل)**', midnight]
			]

			for (const [name, value] of fields) {
				embed.addFields({ name, value, inline: true })
			}


			return ctx.followUp({ embeds: [embed] })
		} catch {
			return ctx.followUp({ content: 'Location not found!' })
		}
	}
}