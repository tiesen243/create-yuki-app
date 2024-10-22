'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Typography } from '@/components/ui/typography'
import { useSession } from '@/hooks/use-session'
import { api } from '@/lib/trpc/react'

export const Post: React.FC = () => {
  const [name, setName] = useState<string>('')

  const session = useSession()
  if (!session)
    return (
      <form action="/api/auth/discord">
        <Button>Sign in</Button>
      </form>
    )

  const [post, { refetch }] = api.post.getLatest.useSuspenseQuery()
  const createPost = api.post.create.useMutation({ onSuccess: () => refetch() })

  console.log(createPost.error)

  return (
    <section className="flex flex-col items-center">
      <Typography>You are signed in as {session.user.username}</Typography>
      <Typography>Your latest post: {post ? post.name : 'No posts yet'}</Typography>

      <form
        className="mt-4 flex gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (!name) return
          createPost.mutate({ name })
          setName('')
        }}
      >
        <Input
          placeholder="What's on your mind?"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={createPost.isPending}
        />
        <Button disabled={createPost.isPending}>
          {createPost.isPending ? 'Posting...' : 'Post'}
        </Button>
      </form>
    </section>
  )
}
