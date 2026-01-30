import { BibleTextView } from '@youversion/platform-react-ui'
import { usePassage } from '@youversion/platform-react-hooks'
import { postToPlugin } from '../lib/postToPlugin'
import { htmlToTree } from '../lib/html-parser'

// const BIBLE_VERSION_ID = 111;
export function PassageFetcher() {
  // const version = useVersion(BIBLE_VERSION_ID);
  const { passage, loading, error } = usePassage({ versionId: 111, usfm: 'JHN.14.5-7', format: 'html', include_headings: true, include_notes: false })

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }

  const handleInsertPassage = () => {
    if (!passage) {
      console.warn('No passage data available')
      return
    }

    // Convert HTML to DOM tree before sending to plugin
    const content = htmlToTree(passage.content || '')

    postToPlugin({
      type: 'INSERT_PASSAGE',
      payload: {
        content,
        reference: 'JHN.14.5-7',
        versionId: 111
      }
    })
  }

  return (
    <div>
      <h1>Bible Plugin</h1>
      <p>This is a plugin for Figma that allows you to fetch passages from the Bible.</p>
      <button onClick={handleInsertPassage} disabled={!passage}>
        Insert Passage
      </button>
      <BibleTextView
        reference="SNG.6.1-10"
        versionId={111}
        fontFamily="serif"
        fontSize={20}
        lineHeight={1.5}
        renderNotes={false}
      />
      
    </div>
  )
}