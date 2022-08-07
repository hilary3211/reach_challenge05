import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

const startingBalance = stdlib.parseCurrency(100);
const accAlice = await stdlib.newTestAccount(startingBalance)
const [Bob1, Bob2, Bob3, Bob4, Bob5, Bob6, Bob7, Bob8, Bob9, Bob10] = await stdlib.newTestAccounts(10, startingBalance);
const myNFT = await stdlib.launchToken(accAlice, "myNFT", "myNFT1", { supply: 1 });
console.log('Hello, Alice and Bobs!');


const ctcAlice = accAlice.contract(backend);
const address_list = []
const showuserBalance = async (acc, name) => {
    const amt = await stdlib.balanceOf(acc);
    const amtNFT = await stdlib.balanceOf(acc, myNFT.id);
    console.log(`${name} has ${stdlib.formatCurrency(amt)} ${stdlib.standardUnit} and ${amtNFT} of the NFT`);
};

const Bob_accs = async (who) => {
    try {
        const ctc = who.contract(backend, ctcAlice.getInfo());
        const address = who.getAddress()
        address_list.push(address)
        who.tokenAccept(myNFT.id)
        const num = Math.floor(Math.random() * 20)
        await ctc.apis.Bob.raffle_tickets(parseInt(num));

    } catch (error) {
        console.log('sorry the max amount of raffle entries have een reached');
    }

}
console.log('Starting backends...');
await showuserBalance(accAlice, 'Alice')
await showuserBalance(Bob1, 'Bob1')
await showuserBalance(Bob2, 'Bob2')
await showuserBalance(Bob3, 'Bob3')
await showuserBalance(Bob4, 'Bob4')
await showuserBalance(Bob5, 'Bob5')
await showuserBalance(Bob6, 'Bob6')
await showuserBalance(Bob7, 'Bob7')
await showuserBalance(Bob8, 'Bob8')
await showuserBalance(Bob9, 'Bob9')
await Promise.all([
    ctcAlice.p.Alice({
        ...stdlib.hasRandom,
        NFTID: async () => {
            return myNFT.id
        },

        Numofaccountconnects: async () => {
            return parseInt(8)
        },
        Maxnumtickets: async () => {
            return parseInt(20)
        },
        showhash: async (hash) => {
            console.log(` The hashed value: ${hash}`)
        },
        Aliceticketnum: async () => {
            return parseInt(18)
        },
        get_Address: async (count) => {
            return address_list[count]
        },
        get_num: async (t) => {
            return [parseInt(stdlib.bigNumberToNumber(t[1]))]
        },
    }),
    await Bob_accs(Bob1),
    await Bob_accs(Bob2),
    await Bob_accs(Bob3),
    await Bob_accs(Bob4),
    await Bob_accs(Bob5),
    await Bob_accs(Bob6),
    await Bob_accs(Bob7),
    await Bob_accs(Bob8),


]);
await showuserBalance(accAlice, 'Alice')
await showuserBalance(Bob1, 'Bob1')
await showuserBalance(Bob2, 'Bob2')
await showuserBalance(Bob3, 'Bob3')
await showuserBalance(Bob4, 'Bob4')
await showuserBalance(Bob5, 'Bob5')
await showuserBalance(Bob6, 'Bob6')
await showuserBalance(Bob7, 'Bob7')
await showuserBalance(Bob8, 'Bob8')
await showuserBalance(Bob9, 'Bob9')


process.exit()
