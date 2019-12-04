import Cookies from 'js-cookie'
const ENV_NOW = process.env

const TokenKey = ENV_NOW.TAGNAME + '-' + 'attendToken'

export function getToken() {
  // return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9haW1pLnRlc3QuY2RweXVuLmNvbSIsImlhdCI6MTUzNDkzNTEyMCwibmJmIjoxNTM0OTM1MTIwLCJleHAiOjE1MzU1NDE3MjAsIm9wZW5faWQiOiJXRVNUQVJfQUlNSV8wYWFlMWUzMDIwMTMxMWU3YmYxZmQ4OWQ2NzJiNjljMCIsImRhdGEiOnsidXNlciI6eyJpZCI6IjE1MSJ9fX0.KszukFVvGLqQxYBQ9Pp1wElT9iBvmghDFWE5Ip7e5jo'
  return Cookies.get(TokenKey)
}

export function getACSToken() {
  // return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9haW1pLnRlc3QuY2RweXVuLmNvbSIsImlhdCI6MTUzNDkzNTEyMCwibmJmIjoxNTM0OTM1MTIwLCJleHAiOjE1MzU1NDE3MjAsIm9wZW5faWQiOiJXRVNUQVJfQUlNSV8wYWFlMWUzMDIwMTMxMWU3YmYxZmQ4OWQ2NzJiNjljMCIsImRhdGEiOnsidXNlciI6eyJpZCI6IjE1MSJ9fX0.KszukFVvGLqQxYBQ9Pp1wElT9iBvmghDFWE5Ip7e5jo'
  return Cookies.get(ENV_NOW.TAGNAME + '-' + 'epToken')
}

export function getDomain() {
  // return 'aimi.test.cdpyun.com'
  return Cookies.get(ENV_NOW.TAGNAME + '-' + 'epHost')
}

export function setToken(token) {
  if (ENV_NOW.ENV === 'LOCAL') {
    return Cookies.set(TokenKey, token)
  } else {
    return Cookies.set(TokenKey, token, { domain: '.ecosaas.com' })
  }
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getCookieByQuery(query) {
  query = ENV_NOW.TAGNAME + '-' + query
  return Cookies.get(query)
}

export function removeCookieByQuery(query) {
  query = ENV_NOW.TAGNAME + '-' + query
  if (ENV_NOW.ENV === 'LOCAL') {
    return Cookies.remove(query)
  } else {
    return Cookies.remove(query, { domain: '.ecosaas.com' })
  }
}

export function setCookieByQuery(query, val) {
  query = ENV_NOW.TAGNAME + '-' + query
  if (ENV_NOW.ENV === 'LOCAL') {
    return Cookies.set(query, val)
  } else {
    return Cookies.set(query, val, { domain: '.ecosaas.com' })
  }
}
