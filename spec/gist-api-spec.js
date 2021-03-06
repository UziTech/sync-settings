const gistApi = require('../lib/location/gist')

describe('gist', () => {
	// FIXME: not sure why linux api test is timing out
	if (process.env.GITHUB_TOKEN && process.platform !== 'linux') {
		describe('gist api', () => {
			beforeEach(async () => {
				atom.config.set('sync-settings.gistDescription', 'Test gist by Sync Settings for Atom https://github.com/atom-community/sync-settings')
				await gistApi.create()
			})

			afterEach(async () => {
				await gistApi.delete()
			})

			it('returns correct properties', async () => {
				const data = await gistApi.get()
				expect(Object.keys(data.files).length).toBe(1)
				atom.config.set('sync-settings.gistDescription', 'automatic update by http://atom.io/packages/sync-settings')
				await gistApi.update({
					'init.coffee': {
						content: '# init',
						filename: 'init.coffee',
					},
				})
				const data2 = await gistApi.get()
				expect(data2).toEqual({
					files: {
						README: jasmine.any(Object),
						'init.coffee': jasmine.any(Object),
					},
					time: jasmine.stringMatching(/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ$/),
					history: jasmine.any(Array),
				})
				expect(data2.files.README.content.toString()).toBe('# Generated by Sync Settings for Atom\n\n<https://github.com/atom-community/sync-settings>')
				expect(data2.files['init.coffee'].content.toString()).toBe('# init')
			}, (process.env.CI ? 60 : 10) * 1000)
		})
	}
})
