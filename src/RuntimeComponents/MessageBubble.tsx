import  type {ChatMessage ,ChatHandlers}  from '../lib/types'
import Markdown from './Markdown'
import UIRenderer from './UIRenderer'

interface MessageBubbleProps {
  message: ChatMessage
  isStreaming: boolean
  currentSchema?: any
  handlers: ChatHandlers
  schemaData?: any,
}

export default function MessageBubble({
  message,
  isStreaming,
//   schemaData,
//   currentSchema,
  handlers
}: MessageBubbleProps) {
  return (
    <div className={`w-full  flex gap-2 sm:gap-3 py-6 ${message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}>

      {/* AI badge */}
      {message.role !== 'user' && (
        <div className="flex flex-col items-center justify-start flex-shrink-0 ">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-bold text-xs sm:text-sm">
            A
          </div>
        </div>
      )}

      {/* Message bubble */}
      <div className={` w-fit py-1 rounded-xl  ${message.role === 'user'
        ? 'bg-indigo-100 text-gray-900 rounded-tr-lg ml-auto '
        : 'bg-gray-100 text-gray-900 rounded-tl-lg   '
        }`}>
        <div className="w-fit">
          {message.schema ? (
            <div className='py-4 overflow-auto max-w-[40vw] mx-4 w-fit'>
              <UIRenderer
                schema={message.schema.ui}   
                data={message.schema.data}   
                handlers={handlers}
                isStreaming={isStreaming}
              />
            </div>
          ) : (
            message.parts?.map((part, index) => (
              <div className='px-4 '>

                <Markdown  key={index} content={part.text} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* User badge */}
      {message.role === 'user' && (
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-indigo-400 text-white flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
          U
        </div>
      )}
    </div>
  )
}
