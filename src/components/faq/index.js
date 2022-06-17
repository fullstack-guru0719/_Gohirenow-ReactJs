import React, { useState } from "react";
import Accordion from "./Accordion";

const faqs = [
  {
    q: `How many job applications should I expect to receive?`,
    a: `On average, a job post receives 35 applications within 24 hours. You can expect to receive more than 100 applications after a week.`,
  },
  {
    q: `Are the virtual assistants on the site employees of GoHireNow?`,
    a: `No, all virtual assistants on the site are individuals that register their own accounts. You are communicating, interviewing, hiring and paying the workers directly. We provide the platform for you two to communicate easily.`,
  },
  {
    q: `Do I have to keep my subscription after I hire someone?`,
    a: `No, you don't have to keep it. There is no time requirement or contracts. When you're done recruiting, you simply cancel your subscription.`,
  },
  {
    q: `How do I cancel my subscription?`,
    a: `To cancel your subscription, in the upper right corner, click on your round image icon, then go to the "Billing" section and then click on "Update Subscription" and downgrade to a Free plan. If you just want a single payment guaranteed not to rebill, simply create a subscription and then immediately cancel the subscription by downgrading to the Free plan.  NOTE: You'll still have upgraded access for the time that you bought.`,
  },
  {
    q: `What does the free account get me?`,
    a: `The free account allows you to post a job, view applicants and their profiles. You can't see applicants contact details until you upgrade. You can only interview virtual assistants once you've paid for an account.`,
  },
  {
    q: `Are they as good as real employees?`,
    a: `Yes, with the thousands of candidates available on GoHireNow, we rarely find an employer who can't find a good fit for their company. Plus, we offer a 100% money back guarantee.`,
  },
  {
    q: `How we are different than Upwork and Freelancer?`,
    a: `We don't take a cut on virtual assistant salaries. We don't mark up worker salaries. We don't get in between your communication with your worker. We don't force you to pay your virtual assistants through us. Upwork encourages short-term, temporary work. We encourage long-term permanent work. Businesses tend to succeed better without 100% turnover.`,
  },
  {
    q: `What's the process for finding, engaging and hiring a virtual assistant?`,
    a: `You find your virtual assistant by searching for talent matches directly based on specific skill criteria and level of expertise and/or through job posting. You engage with virtual assistants using our real-time communication features that consist of private messaging. And finally, you hire your virtual assistant when you have completed a thorough interview process and established a clear agreement regarding expectations, pay rate, payment terms and work schedule.`,
  },
  {
    q: `How do I know I'm hiring the right virtual assistant?`,
    a: `It starts by ensuring the virtual assistant profiles match the skill criteria you are seeking. Next is the initial engagement process. And finally, the interview process. All 3 of these phases play directly into your success in hiring. Each phase must be done thoroughly for the process to work the way it is intended to work. We provide blogs that break down keys to success in all 3 areas.`,
  },
  {
    q: `How do I trust my virtual assistants?`,
    a: `Obviously not everyone is honest, so you would trust a virtual assistant just like you would with a local worker. At first, have them do non-sensitive tasks until you build a relationship of trust, and then later you can give them more access.`,
  },
  {
    q: `How much do I pay a virtual assistant and how do I pay them?`,
    a: `There is no set amount you pay your virtual assistant. Every virtual assistant displays their preferred monthly salary (in US dollars) within their profile. Some virtual assistants charge less than $5 per hour and others charge more. What every remote worker has in common is a desire to have a legitimate chance of securing a stable job and as a result, most are willing to negotiate their pay rate. As far as how you pay them, most virtual assistants have PayPal accounts. However, there are other payment options that your virtual assistant may tell you they'd prefer to use. Since you are the employer, we strongly encourage to use a payment system that you trust and that comes with tracking.`,
  },
  {
    q: `How do I know my virtual assistant is actually working?`,
    a: `There are tools available to you for tracking work in real time. We do not offer any at GoHireNow and don't propose or oppose them – we suggest you set up a system that both you and your remote worker(s) are comfortable with. Ultimately, virtual assistants (and any employees you have) are required to work or complete certain tasks daily, weekly and/or monthly. We find that employers who establish clear guidelines for when and how to review project/task progress and completion usually have a very solid grasp on whether or not their remote worker(s) is working. We also strongly encourage employers to set very clear guidelines for when their virtual assistants are expected to be online and available for communication with you and your team.`,
  },
  {
    q: `What TAXES are involved?`,
    a: `None. This is an overseas sub-contractor. You don't report their wages. You don't pay unemployment insurance. You don't do withholding. You don't have to deal with taxes (please consult an accountant if you are not sure.)`,
  },
];

const Faq = () => {
  const [opened, setOpened] = useState(-1);
  return (
    <div>
      <h2 className="text-center">Frequently Asked Questions </h2>
      <br />
      <br />
      <div className="row">
        <div className="faqs">
          {faqs &&
            faqs.map((faq, idx) => (
              <Accordion
                key={idx}
                q={faq.q}
                a={faq.a}
                idx={idx}
                opened={opened}
                setOpened={setOpened}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
