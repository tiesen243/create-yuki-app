'use client'

import { useState } from 'react'

import type { RouterInputs } from '@/server/api/root'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Typography } from '@/components/ui/typography'
import { api } from '@/lib/trpc/react'

export const Post: React.FC<{ name: string }> = ({ name }) => {
  const [data, setData] = useState<RouterInputs['post']['createPost']>({ content: '' })
  const [latestPost, { refetch }] = api.post.getLatestPost.useSuspenseQuery()
  const createPost = api.post.createPost.useMutation({ onSuccess: () => refetch() })

  return (
    <section className="mt-4 flex flex-col items-start">
      <Typography>You are signed in as {name}</Typography>
      <Typography>Your latest post: {latestPost?.content ?? 'No posts yet'}</Typography>

      <form
        className="mt-4 flex items-center gap-4"
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          createPost.mutate(data)
          setData({ content: '' })
        }}
      >
        <Input
          name="content"
          placeholder="What's on your mind?"
          value={data.content}
          onChange={(e) => setData({ content: e.target.value })}
          disabled={createPost.isPending}
        />
        <Button size="sm" disabled={createPost.isPending}>
          Post
        </Button>
      </form>
    </section>
  )
}
