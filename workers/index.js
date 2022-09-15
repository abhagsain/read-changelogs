/* eslint-disable no-undef */
import { Router } from 'itty-router'
import { error, json } from 'itty-router-extras'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { getJSON } from '../app/utils'

const router = Router()
const GITHUB_URL = 'https://api.github.com'

const getPackageName = async (packageName, RELEASE) => {
  const KV_KEY = `package-${packageName}`
  const KV_DATA = await RELEASE.get(KV_KEY)
  const API_URL = `https://api.npms.io/v2/package/${packageName}`
  console.log('🔌 API_ENDPOINT', API_URL)
  if (isEmpty(KV_DATA)) {
    try {
      const response = await getJSON(API_URL)
      const repoURL = get(response, 'collected.metadata.links.repository')
      if (!repoURL) {
        throw new Error('No repository found')
      }
      const [ownerName, repoName] =
        repoURL
          .split('https://github.com/')
          .join('')
          .split('/') || []
      const data = { ownerName, repoName }
      await RELEASE.put(KV_KEY, JSON.stringify(data))
      return json(data)
    } catch (err) {
      return error(404, {
        status: 404,
        message: `Couldn't find repository named ${packageName}`,
      })
    }
  }

  const parsedData = JSON.parse(KV_DATA)
  return json(parsedData)
}
const getReleaseTags = async ({ authorName, repoName, query, RELEASE }) => {
  const perPage = query?.perPage || 100
  const page = query?.page || 1
  const KV_KEY = `repo-${authorName}-${repoName}-${perPage}-${page}`
  const data = await RELEASE.get(KV_KEY)
  const API_URL = `${GITHUB_URL}/repos/${authorName}/${repoName}/tags?per_page=${perPage}&page=${page}`
  console.log('🔌 API_ENDPOINT', API_URL)
  if (isEmpty(data)) {
    try {
      const data = await getJSON(API_URL)
      if (data instanceof Response || !Array.isArray(data)) {
        return returnError(data)
      }
      const ondDayTTL = 1 * 24 * 60 * 60
      await RELEASE.put(KV_KEY, JSON.stringify(data), {
        expiration: ondDayTTL,
      })
      return json(data)
    } catch (err) {
      return error(404, {
        status: 404,
        error: err,
      })
    }
  }

  const parsedData = JSON.parse(data)
  return json(parsedData)
}

router.get('/api/package/:packageName', async (request, { RELEASE }) => {
  const { packageName } = request.params
  return getPackageName(packageName, RELEASE)
  // const { packageName } = request.params
  // const KV_KEY = `package-${packageName}`
  // const KV_DATA = await RELEASE.get(KV_KEY)
  // const API_URL = `https://api.npms.io/v2/package/${packageName}`
  // console.log('🔌 API_ENDPOINT', API_URL)
  // if (isEmpty(KV_DATA)) {
  //   try {
  //     const response = await getJSON(API_URL)
  //     const repoURL = get(response, 'collected.metadata.links.repository')
  //     if (!repoURL) {
  //       throw new Error('No repository found')
  //     }
  //     const [ownerName, repoName] =
  //       repoURL
  //         .split('https://github.com/')
  //         .join('')
  //         .split('/') || []
  //     const data = { ownerName, repoName }
  //     await RELEASE.put(KV_KEY, JSON.stringify(data))
  //     return json(data)
  //   } catch (err) {
  //     return error(404, {
  //       status: 404,
  //       message: `Couldn't find repository named ${packageName}`,
  //     })
  //   }
  // }

  // const parsedData = JSON.parse(KV_DATA)
  // return json(parsedData)
})

router.get(
  '/api/repos/:authorName/:repoName/tags',
  async (request, { RELEASE }) => {
    const { params, query } = request
    const { authorName, repoName } = params
    return getReleaseTags({ authorName, repoName, query, RELEASE })
  },
)

// router.get('/api/repos/:name/:from/:to', async (request, { RELEASE }) => {
//   const { name, from, to } = request.params
//   const response = await getPackageName(name, RELEASE)
//   if (response instanceof Response) {
//     return response
//   }
//   const { ownerName, repoName } = response
//   const releaseTags = await getReleaseTags({
//     authorName: ownerName,
//     repoName,
//     query: { perPage: 100, page: 1 },
//     RELEASE,
//   })
// })

const returnError = res =>
  error(res.status, {
    status: res.status,
    message: res.statusText,
  })

router.get(
  '/api/repos/:authorName/:repoName/releases/tags/:tagName',
  async (request, { RELEASE }) => {
    const { params } = request
    const { authorName, repoName, tagName } = params
    const KV_KEY = `repo-${authorName}-${repoName}-tags-${tagName}`
    const KVData = await RELEASE.get(KV_KEY)
    const API_URL = `${GITHUB_URL}/repos/${authorName}/${repoName}/releases/tags/${tagName}`
    console.log('🔌 API_ENDPOINT', API_URL)
    if (isEmpty(KVData)) {
      try {
        const data = await getJSON(API_URL)
        if (data instanceof Response) {
          return returnError(data)
        }
        await RELEASE.put(KV_KEY, JSON.stringify(data))
        return json(data)
      } catch (err) {
        console.log('🚀 - file: index.js - line 119 - err', err)
        return error(404, {
          status: 404,
          message: `Couldn't find repository named with ${authorName}/${repoName}`,
          err,
        })
      }
    }
    return json(JSON.parse(KVData))
  },
)

router.all('*', () => new Response('Not Found.', { status: 404 }))

export default {
  fetch: (...args) => {
    return router.handle(...args)
  },
}
