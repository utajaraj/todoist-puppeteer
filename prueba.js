import puppeteer from "puppeteer";
const holdFor = ms => new Promise(res => setTimeout(res, ms));
const main = async () => {

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });
    const browserPage = await browser.newPage();
    await browserPage.goto("https://trello.com/b/QvHVksDa/personal-work-goals", {
        waitUntil: "networkidle2"
    })

    const names = await browserPage.evaluate(() => {
        const info = []
        const cards = document.getElementsByClassName("list-cards")
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const name = card.parentElement.firstChild.childNodes[1].innerText
            for (let j = 0; j < card.children.length; j++) {
                const taskCard = card.children[j];
                const task = taskCard.childNodes[2].childNodes[1].innerText
                info.push({ name, task })
            }
        }

        return info
    })

    await holdFor(2000)
    await browserPage.goto("https://todoist.com/auth/login", {
        waitUntil: "networkidle2"
    })

    await browserPage.focus("#element-0")
    await browserPage.type("#element-0", <email>, { holdFor: 175 })
    await holdFor(2000)
    await browserPage.focus("#element-3")
    await browserPage.type("#element-3", <password>, { holdFor: 175 })
    await holdFor(2000)
    await browserPage.keyboard.press("Enter")

    await holdFor(10000)
    const itemsToAdd = names.slice(0, 5) //get five item per instructions
    for (let i = 0; i < itemsToAdd.length; i++) {
        const item = itemsToAdd.slice(0, 5)[i];
        await holdFor(2000)
        await browserPage.click("#quick_add_task_holder")
        await holdFor(2000)
        const el = browserPage.evaluateHandle(() => document.activeElement);
        const newTodoistTask = `${item.name} | ${item.task}`
        for (let j = 0; j < newTodoistTask.split("").length; j++) {
            await holdFor(175)
            const character = newTodoistTask[j];
            browserPage.keyboard.press(character)
        }
        await holdFor(2000)
        await browserPage.keyboard.press("Enter")
    }


};

main();