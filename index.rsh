'reach 0.1';
const [Outcome, LUCKY, NOTLUCKY] = makeEnum(2)
const winner = (mainnum, guessnum) => {
    if (mainnum === guessnum) {
        return LUCKY
    } else {
        return NOTLUCKY
    }
}
assert(winner(33, 33) == LUCKY)
assert(winner(11, 3) == NOTLUCKY)
export const main = Reach.App(() => {
    const Alice = Participant('Alice', {
        ...hasRandom,
        NFTID: Fun([], Token),
        Numofaccountconnects: Fun([], UInt),
        Maxnumtickets: Fun([], UInt),
        showhash: Fun([Digest], Null),
        Aliceticketnum: Fun([], UInt),
        get_Address: Fun([UInt], Address),
        get_num: Fun([Data({ "None": Null, "Some": UInt })], UInt)
    });
    const Bob = API('Bob', {
        raffle_tickets: Fun([UInt], Null)
    });
    init();

    Alice.only(() => {
        const NftId = declassify(interact.NFTID())
        const numofaccountconnects = declassify(interact.Numofaccountconnects())
        const numoftickets = declassify(interact.Maxnumtickets())
        const _Aliceticknum = interact.Aliceticketnum()
        const [_commitAlice, _saltAlice] = makeCommitment(interact, _Aliceticknum)
        const commitAlice = declassify(_commitAlice)

    })
    Alice.publish(NftId, numofaccountconnects, commitAlice)
    commit()
    Alice.only(() => {
        const seehashvalue = declassify(interact.showhash(commitAlice))
    })
    Alice.publish(seehashvalue)
    const storage_tickets = new Map(Address, UInt)
    const [i] =
        parallelReduce([0])
            .invariant(balance(NftId) == 0)
            .while(i < numofaccountconnects)
            .api(
                Bob.raffle_tickets,
                (ticks, k) => {
                    k(null)
                    storage_tickets[this] = ticks
                    return [i + 1]
                }
            )
    commit()
    Alice.only(() => {
        const saltAlice = declassify(_saltAlice)
        const Aliceticknum = declassify(_Aliceticknum)
    })
    Alice.publish(saltAlice, Aliceticknum)
    checkCommitment(commitAlice, saltAlice, Aliceticknum)
    var [j] = [0]
    invariant(balance(NftId) == 0)
    while (j < numofaccountconnects) {
        commit()
        Alice.only(() => {
            const getadd = declassify(interact.get_Address(j))
        })
        Alice.publish(getadd)
        commit()
        Alice.only(() => {
            const num = declassify(interact.get_num(storage_tickets[getadd]))
        })
        Alice.publish(num)
        const outcome = winner(Aliceticknum, num)
        const luckywinner =
            outcome == LUCKY ? true : false
        if (luckywinner) {
            commit()
            Alice.pay([[1, NftId]])
            transfer([[1, NftId]]).to(getadd)
            j = j + 1
            continue
        } else {
            j = j + 1
            continue
        }

    }
    transfer(balance()).to(Alice)
    commit()
    exit();
});
