---
title: "Introducing Bitcoin Roots"
date: 2026-09-15T22:05:00+02:00
authors:
  - jaromil
tags:
  - bitcoin
  - bitcoin-roots
  - bitcoin-core
  - node-policy
  - consensus
summary: "Reviewable, Bitcoin Core based full-node patch that preserves selected operator controls."
draft: false
---

![Bitcoin Roots logo](bitcoinroots-logo.svg)
{.bitcoin-roots-logo}

I am introducing [Bitcoin Roots](https://plan-b.foundation/bitcoin-roots/), a full-node project I’ll maintain as part of my work as Scientific Director for the Plan ₿ Foundation in Lugano. With this project I intend to carry forward selected conservative policy and operator controls from Bitcoin Knots, with a commitment to produce a versioned patch applicable to Bitcoin Core. Bitcoin Roots will be a built application derived from such an inspectable patch applied on every major release of Bitcoin Core and will always be compatible with its consensus rules.

I am a long-time user and a big fan of Bitcoin Knots. Its attention to the needs of node operators suited the way I run my own machines. I value being able to limit resource consumption and choose which transactions my node relays.

> Knots has served me well, and I remain grateful to Luke Dashjr and the other contributors. My disagreement with its recent direction does not erase that appreciation.
{.pullquote}

## Filtering is a local decision

The cost of running a node is a real concern. More bandwidth, storage and processing power make independent verification less accessible. As an old-timer in Bitcoin, I still consider keeping it practical to run at home one of the project’s objectives. I understand the objection to using Bitcoin for arbitrary data storage: transaction fees pay miners, while node operators bear their own costs.

For me, that objection justifies choosing what my node relays and stores in its mempool, the local collection of unconfirmed transactions. If a miner includes a transaction in a block that meets Bitcoin’s consensus rules, my node should still accept that block. I can decide which transactions my machine handles before confirmation without requiring everyone else to share my preferences.

{{< figure
  src="figure-filtering-local-policy.png"
  alt="Transaction TX is refused by the local relay and mempool policy. It reaches a miner through another path. The same node later validates a block containing TX under Bitcoin consensus and accepts it."
  caption="**Figure 1 — Filtering before confirmation.** The example assumes TX and the complete block satisfy Bitcoin consensus. A transaction refused by local policy can still reach a miner. The node accepts the valid block without applying its mempool policy to the transactions inside it."
  wide="true"
>}}

## Where policy becomes consensus

[BIP-110](https://github.com/bitcoin/bips/blob/master/bip-0110.mediawiki), the Reduced Data Temporary Softfork or RDTS, takes the objection further by proposing temporary consensus restrictions on transaction data and scripts. These rules are mechanically defined, but adopting them means deciding which uses of Bitcoin should remain possible. I do not think the case for those restrictions has been made.

Local filters cannot guarantee that unwanted transactions stay out of the blockchain. Trying to achieve that through consensus restrictions means rejecting some blocks that other Bitcoin nodes would accept. If miners continue building on both sides, the disagreement can become a lasting chain split, with two competing coins. That outcome depends on mining support and economic adoption, not simply on which side has more nodes.

{{< figure
  src="figure-validity-rules.png"
  alt="After a shared history, Core-compatible nodes accept block B containing payment T. A node enforcing an added restriction rejects B and cannot follow its descendants. It may wait or follow an eligible alternative if miners build one."
  caption="**Figure 2 — The consequence of rejecting a block.** Illustrative added restriction. T is confirmed in one accepted history and absent from the other. More work on B’s descendants cannot override a rule that rejects B. A growing alternative branch requires mining support. A soft fork need not cause a lasting split: nodes can reconverge on a chain valid under both sets of rules. See the [Bitcoin Developer Guide](https://developer.bitcoin.org/devguide/block_chain.html#consensus-rule-changes)."
  wide="true"
>}}

BIP-110 goes beyond local filters by restricting script features and how transactions can be constructed. The proposal acknowledges trade-offs for some advanced uses, affecting which funds people can spend and under what conditions. Changes of this kind deserve exceptional scrutiny and broad agreement on their benefits: an unwanted chain split would weaken the entire Bitcoin ecosystem. Reaching that agreement is a political process. It takes time, serious effort to consider every point of view, and close attention to technical detail.

## Why I am leaving Knots

While this dispute remains unresolved, the recent [Knots 29.4.1 release notes](https://github.com/bitcoinknots/bitcoin/blob/v29.4.1.knots20260508/doc/release-notes.md) describe a backward-incompatible protocol change: replacing Bitcoin’s proof-of-work hash function with BLAKE2b and changing the block-weight limit. These changes go beyond both BIP-110 and local policy. Introducing them into one of the most widely used Bitcoin full-node implementations, during an already delicate debate, raises further concerns about maintaining shared consensus.

> This is where I stop following Knots. I want to preserve useful operator controls while continuing to validate Bitcoin on the same terms as Bitcoin Core.
{.pullquote}

Bitcoin Roots is a source-code fork from the Knots 29.3 lineage. It does not enforce RDTS/BIP-110 or adopt the later Knots protocol changes. It continues on the Bitcoin network, without introducing a token or promoting a separate chain.

Bitcoin Core will remain our upstream. This commitment defines the scope of Roots: follow Core's development, review and integrate suitable updates, and preserve consensus compatibility. Our differences should stay small enough to understand and maintain. I want improvements that can be contributed back to reach upstream whenever they fit.

I can disagree with a Core policy default while respecting the work and review behind the codebase. Keeping Core upstream means working within that shared development effort, with room for local choices and responsibility for every difference we carry.

{{< figure
  src="figure-code-inheritance.png"
  alt="Core supplies ongoing upstream development to Roots. The Knots 29.3 lineage supplies selected policy controls. Core and Roots independently validate the same Bitcoin chain as required by the Roots consensus commitment."
  caption="**Figure 3 — Code inheritance and consensus compatibility.** Code lineage and ongoing upstream development are distinct from blockchain history. Roots retains selected Knots controls while committing to Core-compatible consensus. Suitable improvements can be contributed back to Core."
  wide="true"
>}}

## Keeping Core as the trunk

Our update strategy will also differ from Knots. Knots backported Core changes into its own development trunk. We will use Core as our trunk and apply the `-roots` patches on top, in an explicit sequence of commits that can be reviewed in order.

Each Roots release will identify its Core base, whether a release or a specific commit, and explain the purpose of each patch. When updating that base, we will review and adapt the patches, resolve conflicts and test the result. Patches accepted upstream or no longer needed will be dropped.

Anyone reviewing Roots should be able to see exactly what we add to Core, why we add it and why we still need it.

{{< figure
  src="figure-reviewable-patches.png"
  alt="Knots backporting brings selected Core changes into its own trunk. In the planned Roots strategy, a Core base is followed by ordered Roots commits. Moving to a newer Core base requires reviewing and adapting the patch series and testing the result. These are software commits, not blocks."
  caption="**Figure 4 — Keeping the Roots changes reviewable.** The planned update strategy keeps Core as the base and Roots changes as an ordered commit series. Each new Core base requires the patches to be reviewed, adapted where needed and tested. The two patches shown are illustrative. This is a diagram of software development, not blockchain history."
  wide="true"
>}}

## Operator control and reproducible releases

For me, user experience includes protecting the node’s resources. A node that demands more than its operator can spare will eventually be switched off. Clear limits and predictable behaviour matter. Roots retains selected Knots controls for this purpose, with [policy documentation](https://plan-b.foundation/bitcoin-roots/doc/policy/README) that explains their limits. These controls govern which unconfirmed transactions the node accepts into its mempool and relays. They do not change the rules for validating transactions included in blocks.

Binary releases also deserve attention. Bitcoin Core’s reproducible builds provide a foundation for pursuing the same goal in Roots. Our [release organisation](https://plan-b.foundation/bitcoin-roots/ci/README) makes packages easier to identify, with consistent platform and architecture names based on `uname`. Archives extract into versioned directories, keeping their contents together and clearly identified. Release tags use the upstream Core version followed by `-root.#`, where `#` identifies the Roots patch revision for that release. The build configuration includes the graphical interface for Linux, Windows and macOS, and the release workflow prepares a signed checksum manifest so users can verify downloads against the signer’s checksums.

## The work begins

My work on Dyne.org software and Devuan GNU/Linux has taught me that useful software requires sustained work long after the initial idea. Bitcoin Roots is just beginning. I am not claiming it is the best full-node software available: the code must earn your trust through review and use. I will work alongside Giacomo Zucco, S₿AM and the people at Lugano’s Plan ₿ Foundation to keep Roots minimal, reliable and interoperable for anyone who wants to run a local Bitcoin node, including myself.

The [source is open](https://github.com/LuganoPlanB/bitcoin-roots). If you run a node, tell us what makes it difficult to configure or maintain. If you review code, examine what Roots changes in Bitcoin Core, especially where local policy meets consensus validation. I welcome criticism that helps us get the software right.

And come and say hello at the [Plan ₿ Forum in Lugano](https://planb.lugano.ch/planb-forum/) on 23 and 24 October 2026. I will be glad to discuss Bitcoin Roots and the other developments taking place here. Early-bird tickets may still be available, so have a look at the [ticket page](https://planb.lugano.ch/planb-forum/#tickets). Bring your questions and disagreements. I look forward to talking in person.

See you in Lugano :^)
