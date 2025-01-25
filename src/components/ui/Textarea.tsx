import React, { useRef, useEffect } from 'react'

interface AutoResizableTextareaProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder: string
  className: string
}

const AutoResizableTextarea = ({
  value,
  onChange,
  placeholder,
  className
}: AutoResizableTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${className} flex h-10 w-full resize-none overflow-hidden rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
    />
  )
}

export default AutoResizableTextarea
