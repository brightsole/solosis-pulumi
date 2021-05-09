# solosis

[<img src="solosis.svg?sanitize=true" height=250>]()

### What is it?
<details>
  <summary>
    tl;dr: powerful minimal gql lambda dynamodb server
  </summary>
  <br />

Fork the repo, and after one `pulumi up` you'll have the bleeding edge of apollo federation lambda microservices.

So many things today don't help the end user get it deployed; this project makes that the front-and-center goal. Pulumi will deploy to your AWS account and will expand your world by giving you access to a powerful set of tools.

Soon `duosion` will be about, and handle the federation; but for now, this is an **extremely usable** repo, able to spin up a GQL interface connected to a database with things like schemas, auth integrations, a kindly 0-dependencies wrapper around dynamodb, eslinting guidelines, typescript, and lots of tests.

</details>
<br/>

### How to use it?
<details>
  <summary>
    tl;dr: `pulumi up`
  </summary>
  <br />

#### THE PULUMI THAT GOT THIS STARTED
`pulumi config set aws:region ap-southeast-2`
`pulumi config set region ap-southeast-2`
`pulumi config set cloud:provider aws`
`pulumi config set tableName items`
`pulumi config set --secret token something-extra-secret`
`pulumi up`

If you want more, all you have to do is learn a bit more about what you want. But `pulumi` refuses to handle some of the conventions that `serverless` has done in the past. That means you're seeing low level access to AWS api methods in javascript, but it is rounding out the rough edges.

It ends up being quite easy to use and to parse.


### CHOICES THAT HAVE BEEN MADE
1. replacing CD complexity for `graphql-shield`
  - instead of doing things like putting this behind a private VPC subnet, I've decided to have a very basic auth `x-auth-token` header that is checked against requests. That means these apis will remain accessible to anyone that knows the token you set. But that's actually an amazing thing; that means you can test the service **fully** before implementing the gateway, and even after you've done so. The `x-auth-token` header that you send through in your requests can just be added to the federation gateway, and you'll have secure apis **and** the ability to test changes in your microservices.
2. ORM.
  - Dynamodb is complicated, like, quite complicated. I was more comfortable with the much more object-like syntax used by `mongodb` and other modern databases. I wrote less than 100 lines of code to make it appear the same on the outside. I found dynamodb syntax to be full of gotchas like reserved keywords and funky wording. I didn't want to make the end user learn yet another database syntax; the lest fun part of any service.
3. There are, as yet, no schemas beyond those defined by `graphql`. I suspect I'll be adding `yup` soon so you can have identical frontend & backend schema validation.
4. 

</details>
<br/>

### TODO:
<details>
<summary>tl;dr: a bit, but mostly other repos</summary>
<br />

  1. QUERY syntax in the ORM *(I left it off to get it going first)*
  2. fix graphql shield *(it's denying the very basic auth i want it to do)*
  3. create a forked version that handles auth token generation
  4. emit events for every action that is undertaken *(for consumption by amazon eventstream)*

</details>
<br/>