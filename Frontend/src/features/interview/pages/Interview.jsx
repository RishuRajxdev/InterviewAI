import React, { useState } from 'react'
import '../style/interview.scss'
import { useNavigate, useParams } from 'react-router'
import { useInterview } from '../hooks/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth.js' 
import { LogOut, Download, X } from 'lucide-react' // Added X here


const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]

const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)
    return (
        <div className='q-card'>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

const InterviewSkeleton = () => (
    <div className='interview-page'>
        <div className='interview-layout'>
            <nav className='interview-nav'>
                <div className="nav-content">
                    <p className='interview-nav__label'>Sections</p>
                    {[ 1, 2, 3 ].map(i => (
                        <div key={i} className='skeleton skeleton--nav-item' />
                    ))}
                </div>
                <div className='skeleton skeleton--button' />
            </nav>
            <div className='interview-divider' />
            <main className='interview-content'>
                <div className='skeleton skeleton--header' />
                <div className='q-list'>
                    {[ 1, 2, 3 ].map(i => (
                        <div key={i} className='skeleton skeleton--card' />
                    ))}
                </div>
            </main>
            <div className='interview-divider' />
            <aside className='interview-sidebar'>
                <div className='skeleton skeleton--ring' />
                <div className='sidebar-divider' />
                <div className='skeleton skeleton--tag' />
            </aside>
        </div>
    </div>
)


const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const { report, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()
    
    const { handleLogout } = useAuth()
    const navigate = useNavigate()

    const onLogout = async () => {
        const success = await handleLogout()
        if (success) {
            navigate('/login')
        }
    }

    if (loading || !report) {
        return <InterviewSkeleton />
    }

    const scoreColor =
        report.matchScore >= 80 ? 'score--high' :
            report.matchScore >= 60 ? 'score--mid' : 'score--low'

    return (
        <div className='interview-page'>
            <div className='interview-layout'>
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <p className='interview-nav__label'>Sections</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    
                    <div className='interview-nav__actions' style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                        <button onClick={() => { getResumePdf(interviewId) }} className='button primary-button' style={{ width: '100%' }}>
                            <Download size={18} strokeWidth={2} />
                            Download Resume
                        </button>
                        
                        <button onClick={onLogout} className='button primary-button' style={{ width: '100%', backgroundColor: '#ef4444', borderColor: '#ef4444', color: '#ffffff' }}>
                            <LogOut size={14} style={{ marginRight: "0.4rem", flexShrink: 0 }} />
                            Back to Login
                        </button>
                    </div>
                </nav>

                <div className='interview-divider' />

                <main className='interview-content'>
                    {/* ... (Your content sections remain the same) ... */}
                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'><h2>Technical Questions</h2><span className='content-header__count'>{report.technicalQuestions.length} questions</span></div>
                            <div className='q-list'>{report.technicalQuestions.map((q, i) => <QuestionCard key={i} item={q} index={i} />)}</div>
                        </section>
                    )}
                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'><h2>Behavioral Questions</h2><span className='content-header__count'>{report.behavioralQuestions.length} questions</span></div>
                            <div className='q-list'>{report.behavioralQuestions.map((q, i) => <QuestionCard key={i} item={q} index={i} />)}</div>
                        </section>
                    )}
                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'><h2>Preparation Road Map</h2><span className='content-header__count'>{report.preparationPlan.length}-day plan</span></div>
                            <div className='roadmap-list'>{report.preparationPlan.map((day) => <RoadMapDay key={day.day} day={day} />)}</div>
                        </section>
                    )}
                </main>

                <div className='interview-divider' />

                {/* ── Right Sidebar ── */}
                <aside className='interview-sidebar'>
                    
                    {/* CLOSE BUTTON ADDED HERE */}
                    <button onClick={() => navigate('/')} className='sidebar-close-btn'>
                        <X size={20} />
                    </button>

                    <div className='match-score'>
                        <p className='match-score__label'>Match Score</p>
                        <div className={`match-score__ring ${scoreColor}`}>
                            <span className='match-score__value'>{report.matchScore}</span>
                            <span className='match-score__pct'>%</span>
                        </div>
                        <p className='match-score__sub'>Strong match for this role</p>
                    </div>

                    <div className='sidebar-divider' />

                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Skill Gaps</p>
                        <div className='skill-gaps__list'>
                            {report.skillGaps.map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Interview