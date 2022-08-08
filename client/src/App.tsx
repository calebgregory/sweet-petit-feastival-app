import React, { FormEvent, useState } from "react"
import "./App.css"

const info = [
  `If you haven't been up to Greenbrier before, our house has a big backyard
  with lots of room to play. This event will be kid-friendly and dog-friendly,
  so if you have friendly kids and dogs, bring em!`,
  `You're invited to bring your favorite sweet potato foods. The Feastival
  begins at noon to give everyone time to prepare (or whatever) in the
  morning.`,
  `You're encouraged to get adventurous with your experimentations regarding
  what can be done with a sweet potato. If you have a favorite sweet potato
  casserole, by all means, bring it! But we may not all be able to eat very much
  (lol).`,
  `We've been wondering ourselves, "What would sweet potato kimchi be
  like?", "Is it possible to make sweet potato ..cheese?", "...sweet potato
  wine?  or mead?", "A sweet potato elixir??", "Sweet potato icecream???"`,
  `Unfortunately, we won't really be able to share our kitchen, so whatever you
  need to heat it (or reheat it), you'll have responsible for.`,
  `There will be a democratic process whereby each Feastival-goer will vote on
  their favorite dishes. The person whose dish earns the most votes will get a
  prize.`,
  `At some point, I may create a web form that everyone can use to tell everyone
  else what they're planning on bringing. If I do that, I'll send out an email.`,
  `Well, that's it for now. Email or message me with questions
  (<code>calebgregory@gmail.com</code>), and be on the lookout for updates in
  the next 2 months. Looking forward to maybe seeing ya!`,
  `-- Caleb and Brittany`
]

const email_re = /^\S+@\S+\.\S+$/i

function _is_email_valid(email: string): boolean {
  return email_re.test(email)
}

function classnames(...ns: (string | boolean | null | undefined)[]): string {
  return ns.filter(Boolean).join(" ")
}

export function App() {
  const [email, set_email] = useState("")
  const [submitted, set_submitted] = useState(false)
  const [error, set_error] = useState("")

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const e = email.trim().toLowerCase()

    if (e && !_is_email_valid(email)) {
      set_error("invalid email")
      return
    }

    console.log(e)
    set_email("")
    set_submitted(true)
  }

  return (
    <div className="app">
      <h1>🍠!</h1>
      <p>
        You are invited to the{" "}
        <b className="orange">First Annual Sweet Petit Feastival</b>!
      </p>
      <ul>
        <li>
          <b>October 8, 2022, 12 - 6pm Central</b>
        </li>
        <li>
          1004 Minnicks Drive, Greenbrier, TN (
          <a href="https://goo.gl/maps/MDkjhkybCdEZb11G9">map</a>)
        </li>
      </ul>
      <p>
        Please enter your email in this form so that we can send you updates as
        we think of them. We promise not to spam you, and of course you&#39;ll
        be <code>bcc:</code>&#39;d :)
      </p>
      <form onSubmit={handleSubmit}>
        <input
          className={classnames(error && "error")}
          disabled={submitted}
          placeholder={submitted ? "thank you!" : "please gimme your email"}
          type="text"
          value={email}
          onChange={(event) => {
            if (error) {
              set_error("")
            }
            set_email(event.target.value)
          }}
        />
        <button disabled={submitted}>
          {submitted ? "🎉" : "here you go!"}
        </button>
      </form>
      {error && <span id="error">{error}</span>}
      <h4>What to bring</h4>
      <p>
        <ul>
          <li>
            Your favorite <b>yard games</b>
          </li>
          <li>
            Your own <b>plate, cup, and silverware</b> (optional; we&#39;ll have
            some paper plates just in case)
          </li>
          <li>
            A <b>dish</b> (or two (or three)) presenting our fabled sweet potato
            in a form of your choosing!
          </li>
        </ul>
      </p>
      <h4>More info </h4>
      {info.map((n, i) => (
        <p dangerouslySetInnerHTML={{ __html: n }} key={i}></p>
      ))}
    </div>
  )
}
