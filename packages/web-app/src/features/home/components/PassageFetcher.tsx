import { useState } from 'react'
import { BibleTextView } from '@youversion/platform-react-ui'
import { usePassage } from '@youversion/platform-react-hooks'
import { postToPlugin } from '@/lib/postToPlugin'
import { htmlToTree } from '@/lib/html-parser'

export function PassageFetcher() {
  const [versionIdInput, setVersionIdInput] = useState('111')
  const [usfmInput, setUsfmInput] = useState('JHN.14.5-7')
  const [submittedValues, setSubmittedValues] = useState<{
    versionId: number
    usfm: string
  } | null>(null)

  const versionId = Number(versionIdInput)

  const { passage, loading, error } = usePassage({
    versionId: submittedValues?.versionId ?? 0,
    usfm: submittedValues?.usfm ?? '',
    format: 'html',
    include_headings: true,
    include_notes: false,
    options: { enabled: !!submittedValues },
  })

  const handleSubmit = () => {
    if (versionIdInput && usfmInput) {
      setSubmittedValues({ versionId: Number(versionIdInput), usfm: usfmInput })
    }
  }

  const handleBack = () => {
    setSubmittedValues(null)
  }

  const handleInsertPassage = () => {
    if (!passage) {
      console.warn('No passage data available')
      return
    }

    const content = htmlToTree(passage.content || '')

    postToPlugin({
      type: 'INSERT_PASSAGE',
      payload: {
        content,
        reference: passage.id.toString() || '',
        versionId,
      },
    })
  }

  if (!submittedValues) {
    return (
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h1>Bible Plugin</h1>

        <label>
          Version ID
          <input
            type="text"
            value={versionIdInput}
            onChange={(e) => setVersionIdInput(e.target.value)}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>

        <label>
          USFM Reference
          <input
            type="text"
            value={usfmInput}
            onChange={(e) => setUsfmInput(e.target.value)}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>

        <button onClick={handleSubmit} style={{ padding: '8px 16px', marginTop: 8 }}>
          Submit
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleBack} style={{ padding: '8px 16px' }}>
          Back
        </button>
        <button
          onClick={handleInsertPassage}
          disabled={loading || !passage}
          style={{ padding: '8px 16px' }}
        >
          {loading ? 'Loading...' : 'Insert Passage'}
        </button>
      </div>

      {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}

      <div style={{ overflowY: 'auto', maxHeight: 400, border: '1px solid #ccc', padding: 12 }}>
        <BibleTextView
          reference={usfmInput}
          versionId={versionId}
          fontFamily="serif"
          fontSize={20}
          lineHeight={1.5}
          renderNotes={false}
        />
      </div>
    </div>
  )
}
