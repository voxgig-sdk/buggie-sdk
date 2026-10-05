
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { BuggieSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = BuggieSDK.test()
    equal(testsdk instanceof BuggieSDK, true,
      'BuggieSDK.test() must return a client synchronously')
  })

})
