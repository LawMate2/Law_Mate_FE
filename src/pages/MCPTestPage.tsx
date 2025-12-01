import { useState } from 'react'
import { mcpApi } from '../services/api'
import type { EmailPayload, CalendarPayload, DrivePayload } from '../services/api'
import '../pages/pages.css'

export default function MCPTestPage() {
  const [activeTab, setActiveTab] = useState<'email' | 'calendar' | 'drive'>('email')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Email form state
  const [emailForm, setEmailForm] = useState<EmailPayload>({
    to: '',
    subject: '',
    body: '',
    cc: [],
    bcc: [],
    html: false,
    attachments: [],
  })

  // Calendar form state
  const [calendarForm, setCalendarForm] = useState<CalendarPayload>({
    summary: '',
    start_time: '',
    end_time: '',
    description: '',
    location: '',
    attendees: [],
    reminders: [10],
    all_day: false,
  })

  // Drive form state
  const [driveForm, setDriveForm] = useState<DrivePayload>({
    contract_name: '',
    file_path: '',
    contract_date: '',
    parties: [],
    folder_name: 'Contracts',
  })

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await mcpApi.sendEmail(emailForm)
      setResult(response)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCalendarSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await mcpApi.createCalendarEvent(calendarForm)
      setResult(response)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDriveSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await mcpApi.uploadToDrive(driveForm)
      setResult(response)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>MCP Google Services Test</h1>
        <p>Test Gmail, Calendar, and Drive integration</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'email' ? 'active' : ''}`}
          onClick={() => setActiveTab('email')}
        >
          Gmail
        </button>
        <button
          className={`tab ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          Calendar
        </button>
        <button
          className={`tab ${activeTab === 'drive' ? 'active' : ''}`}
          onClick={() => setActiveTab('drive')}
        >
          Drive
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'email' && (
          <form onSubmit={handleEmailSubmit} className="form">
            <h2>Send Email</h2>
            <div className="form-group">
              <label>To:</label>
              <input
                type="email"
                value={emailForm.to}
                onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Subject:</label>
              <input
                type="text"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Body:</label>
              <textarea
                value={emailForm.body}
                onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
                rows={5}
                required
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={emailForm.html || false}
                  onChange={(e) => setEmailForm({ ...emailForm, html: e.target.checked })}
                />
                HTML Email
              </label>
            </div>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Sending...' : 'Send Email'}
            </button>
          </form>
        )}

        {activeTab === 'calendar' && (
          <form onSubmit={handleCalendarSubmit} className="form">
            <h2>Create Calendar Event</h2>
            <div className="form-group">
              <label>Summary:</label>
              <input
                type="text"
                value={calendarForm.summary}
                onChange={(e) => setCalendarForm({ ...calendarForm, summary: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Start Time (ISO 8601):</label>
              <input
                type="datetime-local"
                value={calendarForm.start_time}
                onChange={(e) =>
                  setCalendarForm({ ...calendarForm, start_time: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>End Time (ISO 8601):</label>
              <input
                type="datetime-local"
                value={calendarForm.end_time}
                onChange={(e) => setCalendarForm({ ...calendarForm, end_time: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={calendarForm.description || ''}
                onChange={(e) =>
                  setCalendarForm({ ...calendarForm, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Location:</label>
              <input
                type="text"
                value={calendarForm.location || ''}
                onChange={(e) => setCalendarForm({ ...calendarForm, location: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={calendarForm.all_day || false}
                  onChange={(e) =>
                    setCalendarForm({ ...calendarForm, all_day: e.target.checked })
                  }
                />
                All Day Event
              </label>
            </div>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </form>
        )}

        {activeTab === 'drive' && (
          <form onSubmit={handleDriveSubmit} className="form">
            <h2>Upload to Drive</h2>
            <div className="form-group">
              <label>Contract Name:</label>
              <input
                type="text"
                value={driveForm.contract_name}
                onChange={(e) =>
                  setDriveForm({ ...driveForm, contract_name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>File Path:</label>
              <input
                type="text"
                value={driveForm.file_path || ''}
                onChange={(e) => setDriveForm({ ...driveForm, file_path: e.target.value })}
                placeholder="/path/to/file.pdf"
              />
            </div>
            <div className="form-group">
              <label>Contract Date:</label>
              <input
                type="date"
                value={driveForm.contract_date || ''}
                onChange={(e) =>
                  setDriveForm({ ...driveForm, contract_date: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Folder Name:</label>
              <input
                type="text"
                value={driveForm.folder_name || 'Contracts'}
                onChange={(e) => setDriveForm({ ...driveForm, folder_name: e.target.value })}
              />
            </div>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Uploading...' : 'Upload to Drive'}
            </button>
          </form>
        )}
      </div>

      {error && (
        <div className="result-container error">
          <h3>Error</h3>
          <pre>{error}</pre>
        </div>
      )}

      {result && (
        <div className="result-container success">
          <h3>Result</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
