---
layout: ../../layouts/BlogLayout.astro
title: Switching from Google Analytics to Umami
description: Take full control of your sites statistics by switching from Google Analytics to Umami. Improve performance and create a safer space for your users.
published: 07/08/2021
---

**(Updated 25th August 2021):** [Updating Umami](/blog/switching-from-google-analytics-to-umami#updating-umami) section has been added.

For any new site, there is always the tendency to reach out and grab Google Analytics as the "go to" method for collecting and analysing stats about your site and users. I, for one, have been guilty of that in the past but with the growing popularity of open source analytics and cheaper options out there, more and more developers are looking elsewhere.

## Why move away?

Personally I am trying to move what I can away from Google's ecosystem but, in the grand scheme of things, I think there is something fundamentally wrong with how easily we open up our sites to Google. I think a lot of the time this comes down to convenience and the perceived best practice of it all, which is totally understandable, and something I can relate to. But, with internet privacy becoming an alarming concern for many people I think it makes sense to explore other options, and keep our visitor information safe.

In addition to this, here are some other benefits I can see:

- Analytics is pretty bloated so we should see some performance benefits. Most open source solutions tend to come in at around 2kb, whereas GA comes in at around 40kb which is a huge saving.
- No need for the dreaded GDPR cookie banner! Most self-hosted solutions don't set a cookie or track any personal data, so have saved ourselves a job.
- Most ad blockers block the GA script. By hosting our own solution we will receive uninterrupted, accurate data.
- You'll own the data! Protecting the privacy of your visitors and creating a safer space on the internet.

Note: Before I ventured down the path of self-hosted analytics I researched whether it was possible to set up Google Analytics to be GDPR compliant. At the time of writing this, there was nothing concrete or anything "official". For the amount of developers/site owners that reach for Google Analytics for a new project, I found it interesting and slightly disappointing that there wasn't extensive documentation or guides for this.

## Choosing an Analytics solution

It may be a coincidence or it may be fate but as it happens the first open-source analytics solution I digitally stumbled across was in fact Umami! I first discovered it from [issue #102](https://www.densediscovery.com/archive/) of Kai Brach's Dense Discovery and even though it came out a while back, it still made a big impression on me. In addition to this, thanks to the Twitterverse and "the algorithm", I came across Mike Cao???s ([@cauzilla](https://twitter.com/caozilla?s=21)) post [How I wrote Umami in 30 days](https://medium.com/@caozilla/how-i-wrote-umami-in-30-days-a290372b80e4) which shared some great insights into the inspiration, why the project came to be and how it was created. I???m still pretty blown away that it only took **30 days** from start to \*finish. But as fated as this was I did look at a few other solutions:

[Ackee](https://ackee.electerious.com/) - Free Alternative - Probably the most similar solution to Umami and it would have been my second choice. It seems to be pretty popular and well worth checking out.

[Fathom](https://usefathom.com/) - Paid/Free Trial - I came across this solution from one of [@brianlovin](https://twitter.com/brian_lovin)'s tweets so I thought it was worth checking out (as with anything Brian does). For this site, a huge focus isn't put on the data so I wanted a free solution (however, you can try it out for free for 7 days).

[Splitbee](https://splitbee.io/) - Paid/Conversion Focussed - Created by [Tobias Lins](https://twitter.com/linstobias) [Splitbee](https://splitbee.io/) is a paid service with more of a focus on businesses and conversion. It's got a beautiful UI and some great features, but for me (who wants something super simple) it felt a little overkill.

## Choosing a Hosting solution

Now I had chosen an analytics solution I needed to decide where it was going to be hosted. As a rule, self-hosting an open-source project can be a bit of a pain with many moving parts. Luckily, Umami's docs give you a few options when it comes to hosting, ranging from all-in-one solutions (DigitalOcean, Railway, Heroku) to set up your frontend and back-end separately (Vercel). The biggest thing for me here was finding an easy to use, all-in-one solution so I didn't need to worry about the database and UI layer separately and sign up for two different services. So, as with anything, I did a couple of searches and came across [Railway.app](https://railway.app/) via the blogpost [Self Hosted Web Analytics](https://blog.railway.app/p/self-hosted-website-analytics).

Railway provided everything I wanted above, a single service that automagically deploys the database and front end for you, and linking them together seamlessly. Having never heard of Railway before I was excited to give it a go.

Note: You could also use Heroku which from what I remember should set up your database and UI layer for you, but I've never been a fan of Heroku so that's why I didn't use it.

## Deploying Umami on Railway

I'd like to tell you that it was a complicated process and only really smart people will be able to accomplish this but in reality, it's one of the easiest, friction-free deployment processes I've experienced. Railway provides you with an Umami starter (along with a lot of other starters worth checking out) which automagically deploys your Postgres database and Next frontend for you. To get started you can click [this link](https://railway.app/new/template?template=https%3A%2F%2Fgithub.com%2Frailwayapp-starters%2Fumami&plugins=postgresql&envs=HASH_SALT&HASH_SALTDesc=Any+random+string+used+to+generate+unique+values+for+your+installation).

<aside>
???? This can also be found in the official docs and the blogpost I mentioned before

</aside>

1. You will be asked to sign in to your Github and give Railway some permissions. This is so railway can create an Umami repo for you which you can fork and apply any updates in the future.
2. Give your repo a name and add a random string for your `HASH_SALT` (this can be anything you want) and then click deploy.
3. Once we have clicked deploy the project will start building. At this point, it's a waiting game until it finishes. I'll admit I just ended up staring at the build logs until it finished (no regrets).
4. When the deployment has successfully finished we can click the URL in our Project deployments and low and behold you should see the Umami Admin screen.
5. Sign in with username: **admin** and password: **umami** and make sure to change your password. This can be found in Settings > Profile > Change Password.

## Configuring our website

So we have Umami up and running on Railway and everything is starting to come together. The only thing left for us to do now is to configure our website in Umami and add the tracking script to our website. So let's do just that:

1. Head into our settings page in Umami and click `add website`
2. Fill in the `Name` and `Domain` fields and click save
3. You should see a `</div>` button next to our newly created domain. Click it and copy the tracking code
4. I'm using Next.js so in our `_document.jsx` file (you may need to create this if you haven't already) we can add the following

```js
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {process.env.NODE_ENV === 'production' && (
            // the tracking script copied from umami
            <script
              async
              defer
              data-website-id="your-umami-id"
              src="your-umami-src"
            />
            // end of tracking script from umami
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
```

Notice how I have added the `process.env.NODE_ENV` conditional here to make sure that we are only getting stats sent to umami on production. The conditional could be more complex in my opinion but it works for what I need.

Once your site is deployed with the tracking script you should start to see some stats coming through in Umami.

## Conclusion

There we have it! In a relatively short amount of time, you can move your personal site/project away from Google analytics and have the peace of mind that you own the data and a range of other benefits. I want to give a big thanks to Mike Cao ([@cauzilla](https://twitter.com/caozilla?s=21)) for creating Umami as without him the project wouldn't exist, and if you do switch over I hope you will send him some love. Also, big claps for [railway.app](http://railway.app/) as they have taken the (annoying) problem of self-hosting open-source projects and made the process incredibly easy. What they've built and achieved with this is nothing less than remarkable.

Finally, I do hope you will check out Umami or any of the other listed solutions and migrate away from Google Analytics. I don't think you will regret it.

## Useful Tips

- Umami works great as a PWA (progressive web app) so you can add it to your home screen for quick access (I wouldn't recommend doing this if you feel you would be checking it every 5 minutes).
- The URL generated by Railway is a pretty random one so add a browser bookmark so you don't need to dive into your search history from months ago.
- Probably the most important when writing for fun: don't let the stats dictate what you write. You'll find yourself losing motivation quickly and writing will feel like a chore.

## Updating Umami

Being a relatively young project there are bound to be a lot of updates, so how do we update our Umami repo and deploy it to Railway? After updating from 1.17.0 to 1.22.0 here's how I did it:

1. Clone your Umami repo locally
2. Set your remote upstream to be the Original Umami repo using `git remote add upstream <https://github.com/mikecao/umami.git`>.
3. If we try `git pull origin master` we should get an error `fatal: refusing to merge unrelated histories`. We could force this to happen by appending `-allow-unrelated-histories` but this leaves us with a bunch of merge conflicts. To me (and it may just be me) it makes more sense to "start again" with an upstream to the original repo.
4. To do so we need to run `git reset --hard origin/master`. This will replace all of our local files with what exists in original repos master (the latest update).
5. Looking in the [Railway starters Umami repo](https://github.com/railwayapp-starters/umami) you will notice a couple of extra commits made by FarazPatankar. The [initial setup commit](https://github.com/railwayapp-starters/umami/commit/a2c96c97124547de6f84fd5a98f23bfa32366172) deletes all of the Docker files and creates a script in `/bin` and `package.json`. Taking this as best practice apply the same changes to your updated project.
6. Commit everything and push it up to Github. You may (probably will) need to `f` your `git push` command and once that is pushed Railway will automagically deploy it for you. If your wondering how this happens, you can head to your Railway project and go to Deployments > Triggers. You'll see that it's connected to your repo and auto deploys when any changes are made to your main branch.
7. Your project is now deployed! I did experience a 504 error when eagerly trying to access the deployed site but don't panic like I did and try to revert it all... have a little patience and it'll work just fine.
