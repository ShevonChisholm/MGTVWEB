import { useState } from 'react'
import { featuredArtists, sportsHighlights } from '@/data/mockContent'

const musicCategories = [
  {
    id: 'best-reggae', title: 'Best Reggae Artist',
    nominees: [
      { id: 'a1', name: 'Empress Nia', genre: 'Reggae · R&B', image: featuredArtists[0].thumbnail },
      { id: 'a2', name: 'Jah Roc', genre: 'Roots Reggae', image: featuredArtists[1].thumbnail },
      { id: 'a3', name: 'Shanti V', genre: 'Dancehall · Afrobeats', image: featuredArtists[2].thumbnail },
    ],
  },
  {
    id: 'best-soca', title: 'Best Soca Performance',
    nominees: [
      { id: 'a4', name: 'D-Wave', genre: 'Soca · Reggaeton', image: featuredArtists[3].thumbnail },
      { id: 'a6', name: 'Trini Gold', genre: 'Soca · Calypso', image: featuredArtists[5].thumbnail },
      { id: 'a5', name: 'Coral Wave', genre: 'Gospel · Soul', image: featuredArtists[4].thumbnail },
    ],
  },
  {
    id: 'best-new', title: 'Best New Artist',
    nominees: [
      { id: 'a1', name: 'Empress Nia', genre: 'Reggae · R&B', image: featuredArtists[0].thumbnail },
      { id: 'a4', name: 'D-Wave', genre: 'Soca · Reggaeton', image: featuredArtists[3].thumbnail },
      { id: 'a3', name: 'Shanti V', genre: 'Dancehall · Afrobeats', image: featuredArtists[2].thumbnail },
    ],
  },
  {
    id: 'peoples-choice', title: "People's Choice Award",
    nominees: [
      { id: 'a1', name: 'Empress Nia', genre: 'Reggae · R&B', image: featuredArtists[0].thumbnail },
      { id: 'a2', name: 'Jah Roc', genre: 'Roots Reggae', image: featuredArtists[1].thumbnail },
      { id: 'a6', name: 'Trini Gold', genre: 'Soca · Calypso', image: featuredArtists[5].thumbnail },
    ],
  },
]

const sportsCategories = [
  {
    id: 'outstanding-athlete', title: 'Outstanding Athlete',
    nominees: [
      { id: 'sp1', name: 'Alicia Morgan', genre: 'Track & Field · Jamaica', image: sportsHighlights[0].thumbnail },
      { id: 'sp2', name: 'Devonte Reid', genre: 'Track & Field · Jamaica', image: sportsHighlights[2].thumbnail },
      { id: 'sp3', name: 'Marcus Brown', genre: 'Athletics · Jamaica', image: sportsHighlights[4].thumbnail },
    ],
  },
  {
    id: 'youth-dev', title: 'Youth Development Award',
    nominees: [
      { id: 'sp4', name: 'Kyle James', genre: 'Track & Field · Jamaica', image: sportsHighlights[1].thumbnail },
      { id: 'sp5', name: 'Jade Francis', genre: 'Athletics · Jamaica', image: sportsHighlights[3].thumbnail },
    ],
  },
]

const tabs = ['Music', 'Sports'] as const
type Tab = typeof tabs[number]

interface VoteState {
  categoryId: string
  nomineeId: string
  nomineeName: string
}

export function AwardsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Music')
  const [votes, setVotes] = useState<Record<string, string>>({})
  const [votedState, setVotedState] = useState<VoteState | null>(null)
  const [showModal, setShowModal] = useState(false)

  const categories = activeTab === 'Music' ? musicCategories : sportsCategories

  const handleVote = (categoryId: string, nomineeId: string, nomineeName: string) => {
    setVotedState({ categoryId, nomineeId, nomineeName })
    setShowModal(true)
  }

  const confirmVote = () => {
    if (votedState) {
      setVotes(prev => ({ ...prev, [votedState.categoryId]: votedState.nomineeId }))
    }
    setShowModal(false)
    setVotedState(null)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      {/* Hero */}
      <section className="relative px-8 md:px-16 py-20 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: 'radial-gradient(ellipse at 50% 0%, #C9A84C 0%, transparent 65%)'
        }} />
        <div className="relative max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-12 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] text-xs font-bold tracking-[0.4em] uppercase">MGTV</span>
            <div className="h-px w-12 bg-[#C9A84C]" />
          </div>
          <h1 className="text-7xl md:text-9xl text-[#F5F5F5] leading-none mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            Awards<br />
            <span className="text-[#C9A84C]">2026</span>
          </h1>
          <p className="text-[#A3A3A3] text-base leading-relaxed max-w-lg mx-auto">
            Celebrating the very best in Caribbean music, culture, and sport. Your vote counts. Make it matter.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-full">
            <div className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
            <span className="text-[#EF4444] text-xs font-semibold tracking-wider">VOTING OPEN · CLOSES 30 SEP 2026</span>
          </div>
        </div>
      </section>

      {/* Tab bar */}
      <div className="flex justify-center gap-3 mb-10 px-8">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-2.5 rounded-full text-sm font-semibold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-[#C9A84C] text-[#0A0A0A]'
                : 'bg-[#1E1E1E] text-[#A3A3A3] hover:text-[#F5F5F5] border border-white/8'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Categories */}
      <div className="max-w-[1200px] mx-auto px-8 md:px-16 pb-24 space-y-16">
        {categories.map(category => (
          <div key={category.id}>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-3xl md:text-4xl text-[#F5F5F5]" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                {category.title}
              </h2>
              {votes[category.id] && (
                <span className="flex items-center gap-1.5 text-[#4ADE80] text-xs font-semibold bg-[#1A2A1A] border border-[#4ADE80]/30 px-3 py-1 rounded-full">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                  Voted
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {category.nominees.map(nominee => {
                const isVoted = votes[category.id] === nominee.id
                const categoryVoted = !!votes[category.id]
                return (
                  <div
                    key={nominee.id}
                    className={`relative rounded-2xl overflow-hidden border transition-all ${
                      isVoted
                        ? 'border-[#C9A84C] shadow-[0_0_24px_rgba(201,168,76,0.2)]'
                        : 'border-white/8 hover:border-white/20'
                    }`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={nominee.image}
                        alt={nominee.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent" />
                      {isVoted && (
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center">
                          <svg className="w-4 h-4 text-[#0A0A0A]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-5 bg-[#141414]">
                      <p className="text-[#F5F5F5] text-base font-semibold">{nominee.name}</p>
                      <p className="text-[#6B6B6B] text-xs mt-0.5 mb-4">{nominee.genre}</p>
                      <button
                        onClick={() => !categoryVoted && handleVote(category.id, nominee.id, nominee.name)}
                        disabled={categoryVoted}
                        className={`w-full py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                          isVoted
                            ? 'bg-[#C9A84C] text-[#0A0A0A]'
                            : categoryVoted
                              ? 'bg-[#1E1E1E] text-[#3A3A3A] cursor-not-allowed'
                              : 'bg-[#1E1E1E] text-[#F5F5F5] hover:bg-[#2A2A2A] border border-white/8 hover:border-[#C9A84C]/30'
                        }`}
                      >
                        {isVoted ? '✓ Your Vote' : 'Vote'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Vote confirmation modal */}
      {showModal && votedState && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative bg-[#141414] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-[#2A2010] border border-[#C9A84C]/30 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl text-[#F5F5F5] mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Confirm your vote</h3>
            <p className="text-[#A3A3A3] text-sm mb-1">You are voting for</p>
            <p className="text-[#C9A84C] text-lg font-semibold mb-1">{votedState.nomineeName}</p>
            <p className="text-[#6B6B6B] text-xs mb-6">This action cannot be undone. You can only vote once per category.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-[#A3A3A3] text-sm hover:text-[#F5F5F5] hover:border-white/20 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmVote}
                className="flex-1 py-3 rounded-xl bg-[#C9A84C] text-[#0A0A0A] text-sm font-semibold hover:bg-[#E2C36A] transition-colors cursor-pointer"
              >
                Cast Vote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
