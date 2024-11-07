import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { OAuth2RequestError } from 'arctic'

import { discord, lucia } from '@/server/auth/lucia'
import { db } from '@/server/db'

export const GET = async (req: NextRequest) => {
  const cookie = await cookies()

  try {
    const url = new URL(req.url)
    const code = url.searchParams.get('code') ?? ''
    const state = url.searchParams.get('state') ?? ''
    const storedState = req.cookies.get('discord_oauth_state')?.value ?? ''
    cookie.delete('discord_oauth_state')
    if (!code || !state || state !== storedState) throw new Error('Invalid state')

    const tokens = await discord.validateAuthorizationCode(code)
    const accessToken = tokens.accessToken()

    const response = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json() as Promise<DiscordUser>)
      .then((user) => ({
        discordId: user.id,
        email: user.email,
        username: user.username,
        name: user.global_name,
        avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
      }))
      .catch(() => {
        throw new Error('Failed to fetch user data from Discord')
      })

    let user = await db.user.findFirst({ where: { discordId: response.discordId } })
    if (!user) user = await db.user.create({ data: response })
    else user = await db.user.update({ where: { discordId: response.discordId }, data: response })

    const session = await lucia.createSession(user.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookie.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return NextResponse.redirect(new URL('/', req.url))
  } catch (e) {
    if (e instanceof OAuth2RequestError)
      return NextResponse.json({ error: e.message }, { status: Number(e.code) })
    else if (e instanceof Error) return NextResponse.json({ error: e.message }, { status: 500 })
    else return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
  }
}

interface DiscordUser {
  id: string
  email: string
  username: string
  global_name: string
  avatar: string
}
