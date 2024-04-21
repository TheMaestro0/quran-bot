import { Config } from '@types'

console.log(process.env.DISCORD_TOKEN)

export default <Config> {
	token: process.env.DISCORD_TOKEN,
	status: 'إذا قرأ القرآن فاستمعوا له وأنصتوا لعلكم ترحمون'
}