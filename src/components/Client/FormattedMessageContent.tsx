import React from 'react'

interface FormattedMessageContentProps {
  content: string
}

const FormattedMessageContent: React.FC<FormattedMessageContentProps> = ({
  content
}) => {
  const renderLine = (line: string, index: number) => {
    // Identify and style bullet points, numbered lists, headings, links, tables, bold, italic, and blockquotes
    if (line.startsWith('- ')) {
      return (
        <li key={index} className='mb-1 list-inside list-disc'>
          {line.slice(2).trim()}
        </li>
      )
    } else if (/^\d+\. /.test(line)) {
      return (
        <li key={index} className='mb-1 list-inside list-decimal'>
          {line.slice(3).trim()}
        </li>
      )
    } else if (line.startsWith('# ')) {
      return (
        <h2 key={index} className='mb-2 text-lg font-bold'>
          {line.slice(2).trim()}
        </h2>
      )
    } else if (line.startsWith('## ')) {
      return (
        <h3 key={index} className='text-md mb-1 font-semibold'>
          {line.slice(3).trim()}
        </h3>
      )
    } else if (line.startsWith('### ')) {
      return (
        <h4 key={index} className='mb-1 text-base font-medium'>
          {line.slice(4).trim()}
        </h4>
      )
    } else if (/(\*\*([^*]+)\*\*)/.test(line)) {
      const match = line.match(/(\*\*([^*]+)\*\*)/)
      if (match) {
        const [_, text] = match
        return (
          <strong key={index} className='font-bold'>
            {text.replace(/\*\*/g, '')}
          </strong>
        )
      }
    } else if (/\*(.+)\*/.test(line)) {
      const match = line.match(/\*(.+)\*/)
      if (match) {
        const [_, text] = match
        return (
          <em key={index} className='italic'>
            {text}
          </em>
        )
      }
    } else if (/^> /.test(line)) {
      return (
        <blockquote
          key={index}
          className='border-l-4 border-gray-300 pl-4 italic text-gray-600'
        >
          {line.slice(2).trim()}
        </blockquote>
      )
    } else if (/\[.+\]\(.+\)/.test(line)) {
      const match = line.match(/\[(.+)\]\((.+)\)/)
      if (match) {
        const [_, text, url] = match
        return (
          <a key={index} href={url} className='text-blue-600 hover:underline'>
            {text}
          </a>
        )
      }
    } else if (line.startsWith('|')) {
      const cells = line
        .split('|')
        .slice(1, -1)
        .map(cell => cell.trim())
      return (
        <tr key={index}>
          {cells.map((cell, cellIndex) => (
            <td key={cellIndex} className='border px-2 py-1'>
              {cell}
            </td>
          ))}
        </tr>
      )
    } else {
      return (
        <p key={index} className='mb-2'>
          {line.trim()}
        </p>
      )
    }
  }

  const lines = content.split('\n')
  const tableLines = lines.filter(line => line.startsWith('|'))
  const otherLines = lines.filter(line => !line.startsWith('|'))

  return (
    <div>
      {otherLines.map((line, index) => renderLine(line, index))}
      {tableLines.length > 0 && (
        <table className='mt-4 table-auto border-collapse border border-gray-300'>
          <tbody>
            {tableLines.map((line, index) => renderLine(line, index))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default FormattedMessageContent
