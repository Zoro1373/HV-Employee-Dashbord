import React, { useState, useEffect, useRef } from 'react';
import Icon from '../components/Icon';
import AnimatedTooltipPreview from '../components/ui/AnimatedTooltipPreview';
import SpotlightCard from '../components/SpotlightCard';
import Dropdown from '../components/ui/dropdown';
import { fmtT, now, hms } from '../utils/time';
import { hvTeamMembers } from '../data/teamMembers';

export default function ChatPage({
  chatMessages,
  botMessages,
  currentChannel,
  currentTab,
  onTabChange,
  onChannelChange,
  onSendMessage,
  onSendBotMessage,
  onToast,
  deadline,
  portalState,
}) {
  const [inputText, setInputText] = useState('');
  const [channels, setChannels] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hv-demo-chat-groups')) || ['# alpha', '# motor-ctrl', '# fw-team']; } catch { return ['# alpha', '# motor-ctrl', '# fw-team']; }
  });
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupAudience, setNewGroupAudience] = useState('Cross-department');
  const [attachment, setAttachment] = useState(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [showMeeraTyping, setShowMeeraTyping] = useState(true);
  const messagesEndRef = useRef(null);

  const directMemberIndex = currentChannel - channels.length;
  const conversationName = directMemberIndex >= 0
    ? hvTeamMembers[directMemberIndex]?.name
    : channels[currentChannel];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, botMessages, isBotTyping, currentTab, showMeeraTyping]);

  const meeraTimerRef = useRef(false);
  useEffect(() => {
    if (!meeraTimerRef.current && currentTab === 'team') {
      meeraTimerRef.current = true;
      const timer = setTimeout(() => {
        setShowMeeraTyping(false);
        onSendMessage({
          who: 'Meera Shah',
          t: '16:09',
          txt: 'Bench test passed. Merging after review.',
        });
      }, 4200);
      return () => clearTimeout(timer);
    }
  }, [currentTab, onSendMessage]);

  const botAnswer = (q) => {
    const s = q.toLowerCase();
    const n = now();
    if (/deadline|close|when/.test(s)) {
      return portalState === 'closed'
        ? `Your Alpha upload closed at ${fmtT(deadline)} IST. The portal now returns HTTP 423. Ask an admin for an extension pass.`
        : `Your Alpha firmware upload closes at ${fmtT(deadline)} IST, in ${hms(deadline - n)}.`;
    }
    if (/late|policy|penalt/.test(s)) {
      return 'Hard lockout is the default: uploads stop at the deadline. Projects set to soft lockout accept late files and flag them with a penalty.';
    }
    if (/download|vault|link|unlock/.test(s)) {
      return 'Confidential files unlock inside a release window. Each download link works for 300 seconds, then returns HTTP 410.';
    }
    return 'I can answer questions about your deadlines, downloads and company policy. For anything else, ask an admin.';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = inputText.trim();
    if (currentTab === 'bot' && !text) {
      onToast('Type a question for the assistant first');
      return;
    }
    if (currentTab !== 'bot' && !text && !attachment) {
      onToast('Write a message or attach a file first');
      return;
    }
    setInputText('');

    if (currentTab === 'bot') {
      setAttachment(null);
      onSendBotMessage({ me: true, txt: text });
      setIsBotTyping(true);
      setTimeout(() => {
        setIsBotTyping(false);
        onSendBotMessage({ bot: true, txt: botAnswer(text) });
      }, 900);
    } else {
      const msgId = Date.now();
      const timeStr = fmtT(now()).slice(0, 5);
      const messageText = [text, attachment ? `Attachment: ${attachment.name} (${Math.max(1, Math.round(attachment.size / 1024))} KB)` : ''].filter(Boolean).join(' · ');
      onSendMessage({ id: msgId, me: true, t: timeStr, txt: messageText, seen: 'Sent' });
      if (attachment) onToast(`${attachment.name} attached to this demo message.`);
      setAttachment(null);

      setTimeout(() => {
        onSendMessage({ id: msgId, updateSeen: `Seen ${fmtT(now()).slice(0, 5)}` });
      }, 1600);
    }
  };

  const handleChipClick = (question) => {
    onSendBotMessage({ me: true, txt: question });
    setIsBotTyping(true);
    setTimeout(() => {
      setIsBotTyping(false);
      onSendBotMessage({ bot: true, txt: botAnswer(question) });
    }, 900);
  };

  const createGroup = (event) => {
    event.preventDefault();
    const name = newGroupName.trim().replace(/^#\s*/, '');
    if (name.length < 2) return onToast('Enter a group name with at least 2 characters.', 'bad');
    const next = [...channels, `# ${name} · ${newGroupAudience}`];
    setChannels(next);
    try { localStorage.setItem('hv-demo-chat-groups', JSON.stringify(next)); } catch { /* Demo persistence is optional. */ }
    setNewGroupName('');
    setNewGroupAudience('Cross-department');
    setShowGroupForm(false);
    onTabChange('team');
    onChannelChange(next.length - 1);
    onToast(`Group ${name} (${newGroupAudience}) created in this browser demo.`);
  };

  return (
    <>
      <div className="head rise">
        <div>
          <h1>Messages & Groups</h1>
          <p className="sub">Direct conversations, team channels, and a local attachment demo.</p>
        </div>
        <div className="seg">
          <button
            className={currentTab === 'team' ? 'on' : ''}
            onClick={() => onTabChange('team')}
          >
            Team chat
          </button>
          <button
            className={currentTab === 'bot' ? 'on' : ''}
            onClick={() => onTabChange('bot')}
          >
            Assistant
          </button>
        </div>
      </div>

      {/* Team Members Section near Team Chat Header */}
      {currentTab === 'team' && (
        <SpotlightCard className="team-members-bar card rise" style={{ '--i': 0.5 }}>
          <div className="team-members-header">
            <div className="team-members-title-group">
              <span className="team-members-kicker">COLLABORATION</span>
              <h2 className="team-members-title">Team Members</h2>
            </div>
            <span className="team-members-meta">6 assigned · Alpha firmware group</span>
          </div>

          <div className="team-members-content">
            <AnimatedTooltipPreview
              onSelectMember={(member) => {
                const memberIndex = hvTeamMembers.findIndex((person) => person.id === member.id);
                onTabChange('team');
                onChannelChange(channels.length + Math.max(0, memberIndex));
                onToast(`Viewing the local demo conversation with ${member.name}`);
              }}
              onToast={onToast}
            />
          </div>
        </SpotlightCard>
      )}

      <div className="chatwrap rise" style={{ '--i': 1 }}>
        <SpotlightCard className="card">
          <div className="ct">
            <h2>Conversations</h2>
            <button className="btn out sm" onClick={() => setShowGroupForm((value) => !value)}><Icon name="plus" />New group</button>
          </div>
          {showGroupForm && <form className="compose group-create-form" onSubmit={createGroup}><input value={newGroupName} onChange={(event) => setNewGroupName(event.target.value)} placeholder="Group name" aria-label="New group name" autoFocus /><Dropdown items={['Cross-department', 'BDA', 'Electrical', 'Developers', 'Digital Marketing']} value={newGroupAudience} onChange={setNewGroupAudience} aria-label="Group participants" size="sm" /><button className="btn pri sm" type="submit">Create group</button></form>}
          <div className="chan">
            {channels.map((c, i) => (
              <button
                key={c}
                className={currentChannel === i && currentTab === 'team' ? 'on' : ''}
                onClick={() => {
                  onTabChange('team');
                  onChannelChange(i);
                }}
              >
                {c}
              </button>
            ))}

            <div className="grp" style={{ paddingLeft: 12 }}>
              Direct
            </div>
            <button
              className={currentChannel === channels.length && currentTab === 'team' ? 'on' : ''}
              onClick={() => {
                onTabChange('team');
                onChannelChange(channels.length);
              }}
            >
              <span className="ava" style={{ width: 24, height: 24, fontSize: 10 }}>
                RK
              </span>
              Ravi Kumar
            </button>
            <button
              className={currentChannel === channels.length + 1 && currentTab === 'team' ? 'on' : ''}
              onClick={() => {
                onTabChange('team');
                onChannelChange(channels.length + 1);
              }}
            >
              <span className="ava" style={{ width: 24, height: 24, fontSize: 10 }}>
                MS
              </span>
              Meera Shah
            </button>
          </div>
        </SpotlightCard>

        <SpotlightCard className="card" id="chatcard">
          {currentTab === 'bot' ? (
            <>
              <div className="ct">
                <h2>Company assistant</h2>
                <button
                  className="btn out sm"
                  onClick={() => onToast('Escalated to an admin. Your chat history is attached.')}
                >
                  <Icon name="users" />
                  Ask an admin
                </button>
              </div>

              <div className="msgs">
                {botMessages.map((m, i) => (
                  <div key={i} className={`m ${m.me ? 'me2' : ''}`}>
                    {!m.me && (
                      <div className="ava">
                        <Icon name="bot" />
                      </div>
                    )}
                    <div className="bub">{m.txt}</div>
                  </div>
                ))}

                {isBotTyping && (
                  <div className="m">
                    <div className="ava">
                      <Icon name="bot" />
                    </div>
                    <div className="bub">
                      <span className="dots">
                        <i />
                        <i />
                        <i />
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chips">
                <button onClick={() => handleChipClick('When is my upload deadline?')}>
                  When is my upload deadline?
                </button>
                <button onClick={() => handleChipClick('What is the late upload policy?')}>
                  Late upload policy
                </button>
                <button onClick={() => handleChipClick('How do vault downloads work?')}>
                  How do downloads work?
                </button>
              </div>

              <form className="compose" onSubmit={handleSubmit} autoComplete="off">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask about projects or policy"
                  aria-label="Message the assistant"
                />
                <button className="btn pri" type="submit">
                  <Icon name="send" />
                  Send
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="ct">
                <h2>{conversationName || channels[0]}</h2>
                <span className="pill good">Demo conversation</span>
              </div>

              <div className="msgs">
                {chatMessages.map((m, i) => {
                  if (m.me) {
                    return (
                      <div key={i} className="m me2">
                        <div className="bub">
                          {m.txt}
                          <small>
                            {m.t} · {m.seen || 'Sent'}
                          </small>
                        </div>
                      </div>
                    );
                  }

                  const initials = (m.who || 'User')
                    .split(' ')
                    .map((w) => w[0])
                    .join('');

                  return (
                    <div key={i} className="m">
                      <div className="ava">{initials}</div>
                      <div className="bub">
                        <b>{m.who}</b>
                        {m.txt}
                        {m.code && (
                          <pre className="code">
                            <span className="k">assign</span>{' '}
                            <span className="f">led_en</span> = en &amp; ~
                            <span className="n">rst_n</span>;
                          </pre>
                        )}
                        <small>{m.t}</small>
                      </div>
                    </div>
                  );
                })}

                {showMeeraTyping && (
                  <div className="m">
                    <div className="ava">MS</div>
                    <div className="bub">
                      <span className="dots">
                        <i />
                        <i />
                        <i />
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {attachment && <div className="chat-attachment-preview"><Icon name="file" /><span>{attachment.name} · {Math.max(1, Math.round(attachment.size / 1024))} KB</span><button type="button" className="btn ghost sm" onClick={() => setAttachment(null)} aria-label="Remove attachment"><Icon name="x" /></button></div>}
              <form className="compose" onSubmit={handleSubmit} autoComplete="off">
                <label className="chat-attach-button" title="Choose a local file"><Icon name="paperclip" /><input type="file" onChange={(event) => setAttachment(event.target.files?.[0] || null)} aria-label="Attach a local file" /></label>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Message the team"
                  aria-label="Message the team"
                />
                <button className="btn pri" type="submit">
                  <Icon name="send" />
                  Send
                </button>
              </form>
            </>
          )}
        </SpotlightCard>
      </div>
    </>
  );
}
