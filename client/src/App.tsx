import React from "react"

import "./App.css"
import { useCore } from "./app/core-context"
import { EmailRegistrationForm } from "./components/EmailRegistrationForm"
import { ParticipantsTable } from "./components/ParticipantsTable"
import { register } from "./coordinate/register"

const what_to_bring = [
  "Your favorite <b>yard games</b>",
  "Your own <b>plate, cup, and silverware</b> (optional; we'll have some paper plates just in case)",
  "A <b>dish</b> (or two (or three)) presenting our fabled sweet potato in a form of your choosing!"
]

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
  need to heat it (or reheat it), you'll have to be responsible for. <i>Update: If that
  makes things complicated or difficult because you're traveling, hit us up,
  because we'll make exceptions.</i>`,
  `There will be a democratic process whereby each Feastival-goer will vote on
  their favorite dishes. The person whose dish earns the most votes will get a
  prize.`,
  `Well, that's it. Email or message me with questions
  (<code>calebgregory@gmail.com</code>). Looking forward to seeing ya!`,
  `-- Caleb and Brittany`
]

export function App() {
  const core = useCore()
  const {
    state_tree: { participants, user_email, user_id }
  } = core

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
      <EmailRegistrationForm
        submit={(email) => register(core, { email })}
        user_email={user_email}
      />
      <h4>What to bring</h4>
      <ul>
        {what_to_bring.map((wtb, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: wtb }}></li>
        ))}
      </ul>
      <ParticipantsTable
        participants={participants}
        submit={(input) => register(core, input)}
        user_email={user_email}
        user_id={user_id}
      />
      <h4>More info </h4>
      {info.map((n, i) => (
        <p key={i} dangerouslySetInnerHTML={{ __html: n }}></p>
      ))}
    </div>
  )
}
