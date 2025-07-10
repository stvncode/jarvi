import { ArrowRight, Mail, MessageSquare, Send, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
<div>
      <div className="relative overflow-hidden">        
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <img src="/jarvi.png" alt="Jarvi" className="w-16 mx-auto mb-2" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Analysez vos{" "}
              <span className="bg-gradient-to-r from-blue-800 to-indigo-900 bg-clip-text text-transparent">
                performances
              </span>
              <br />
              de prospection
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              Découvrez quels types de messages génèrent le meilleur taux de réponse 
              et optimisez votre stratégie de prospection.
            </p>
            <Link
              href="/statistics"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Sparkles className="h-6 w-6" />
              Voir mes statistiques
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">Email</div>
                <div className="text-gray-600">Campagnes directes</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">LinkedIn</div>
                <div className="text-gray-600">Messages directs</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Send className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">InMail</div>
                <div className="text-gray-600">Messages premium</div>
              </div>
            </div>
          </div>
        </div>
      </div></div>
  );
}
