# solosis

[<img src="solosis.svg?sanitize=true" height=250>]()

### What is it?
<details>
  <summary>
    tl;dr: powerful minimal gql lambda dynamodb server
  </summary>
  <br />

Click **Use this template**, and after one `pulumi up` you'll have the bleeding edge of apollo federation lambda microservices.

So many projects today don't help the end user get it deployed; this project makes that the front-and-center goal. Pulumi will deploy to your AWS account and will expand your world by giving you access to a powerful set of tools.

Soon `duosion` will be about, and handle the federation; but for now, this is an **extremely usable** repo, able to spin up a GQL interface connected to a database with features like schemas, auth integrations, a kindly 1-dependency wrapper around dynamodb, eslinting guidelines, typescript, and good tests.

</details>
<br/>

### How to use it?
<details>
  <summary>
    tl;dr: <code>pulumi up</code>
  </summary>
  <br />

#### STEPS
- fork it
- *(probably)* brew install pulumi
- `npm ci`
- `pulumi login`
- `pulumi config set --secret token "some new secret token"` *(don't want to keep the same token I've set, i don't think it'll even let you)*
- `pulumi up`

That will output the URL you've deployed the service to in AWS! EXCITING!!!

Then you can start by modifying configs! `Things` is a terrible database name, and a `thing` is so generic that it's impossible to know what to expect. Just start bashing away, you can even point a frontend at it, and have a beautiful working backend seconds after getting started!

#### THE PULUMI THAT GOT THIS STARTED
```sh
pulumi config set aws:region ap-southeast-2
pulumi config set cloud:provider aws
pulumi config set tableName things
pulumi config set --secret token some-extra-secret-secret
pulumi up
```

If you want more, all you have to do is learn a bit more about what you want. But `pulumi` refuses to handle some of the conventions that `serverless` has done in the past. That means you're seeing low level access to AWS api methods in javascript, but it is rounding out the rough edges.

It ends up being quite easy to use and to parse.


### CHOICES THAT HAVE BEEN MADE
1. assuming all items within will have a `hashKey` that isn't unique, and an `id` that is. This means we're assuming most gets will be for a small list of items related to a `userId` or anything similar *(implemented in this example repo as an `x-user-id` header that is put into context as `hashKey`)*
1. replacing CD complexity for `graphql-shield`
    - instead of doing complicated devops like putting this behind a private VPC subnet, I've decided to have a very basic auth `x-auth-token` header that is checked against requests. That means these apis will remain accessible to anyone that knows the token you set. But that's actually an amazing feature; that means you can test the service **fully** before implementing the gateway, and even after you've done so. The `x-auth-token` header that you send through in your requests can just be added to the federation gateway, and you'll have secure apis **and** the ability to test changes in your microservices.
1. replacing DB string complexity with an [ORM](https://www.npmjs.com/package/@brightsole/sleep-talk)
    - Dynamodb is complicated, like, quite complicated. I was more comfortable with the much more object-like syntax used by `mongodb` and other modern databases. I wrote a couple hundred lines of code to make it appear the same on the outside. I found dynamodb syntax to be full of gotchas like reserved keywords and funky wording. I didn't want to make the end user learn yet another database syntax; the least fun part of any service.
1. There are, as yet, no schemas beyond those defined by `graphql`. I suspect I'll be adding `yup` soon so you can have identical frontend & backend schema validation.

</details>
<br/>

### TODO:
<details>
<summary>tl;dr: a few fixes, but mostly example repos</summary>
<br />

  1. fix graphql shield *(it's denying the very basic auth i want it to do)*
  1. create a forked version that handles auth token generation
  1. emit events for every action that is undertaken *(for consumption by amazon eventstream)*

</details>
<br/>

<a href="https://www.buymeacoffee.com/Ao9uzMG" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
