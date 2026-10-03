import { StudioHero } from "../StudioHero";
import React, { Component, Fragment } from "react";
import { cssStyle, sitePath } from "./utils";
import { Footer } from "./Footer";

export class Home extends Component<{
  active?: string;
  title?: string;
  copy?: string;
  tool?: string;
}> {
  state = { ba: "before", kov: 0 };

  renderVals() {
    const P = "/work/";
    const isBefore = this.state.ba === "before";
    const kovShots = [
      {
        label: "Bioklimatická pergola",
        img: P + "koverta/konfigurator-pergola.webp",
        fit: "cover",
      },
      { label: "Hliníkový carport", img: P + "koverta/konfigurator-carport.webp", fit: "cover" },
      { label: "Na mobile", img: P + "koverta/konfigurator-mobil.webp", fit: "contain" },
    ];
    const themes = [
      {
        bg: "#FFFFFF",
        fg: "#0E1512",
        muted: "#5C645F",
        line: "rgba(14,21,18,.12)",
        btnBg: "#0C1A15",
        btnFg: "#fff",
      },
      {
        bg: "#ECEAE3",
        fg: "#0E1512",
        muted: "#5C645F",
        line: "rgba(14,21,18,.14)",
        btnBg: "#0C1A15",
        btnFg: "#fff",
      },
      {
        bg: "#0C1A15",
        fg: "#FFFFFF",
        muted: "rgba(255,255,255,.7)",
        line: "rgba(255,255,255,.14)",
        btnBg: "#C9F26B",
        btnFg: "#0C1A15",
      },
      {
        bg: "#1F5B47",
        fg: "#FFFFFF",
        muted: "rgba(255,255,255,.78)",
        line: "rgba(255,255,255,.18)",
        btnBg: "#fff",
        btnFg: "#0C1A15",
      },
    ];
    const work = [
      {
        name: "Koverta",
        domain: "koverta.sk",
        href: "https://koverta.sk/",
        type: "Výroba na mieru · 3D konfigurátor",
        result:
          "Zákazník si prístrešok alebo pergolu poskladá v 3D a dopyt pošle aj s hotovou zostavou.",
        img: P + "koverta/realizacia-pergola-sibenik.webp",
        tools: ["3D konfigurátor", "Dopyt so zostavou"],
        case: true,
        caseHref: "/3d-konfigurator",
      },
      {
        name: "DERAT",
        domain: "derat.sk",
        href: "https://derat.sk/",
        type: "Služby · kalkulačka a dopytový asistent",
        result:
          "Kalkulačka prevedie návštevníka od problému k orientačnej cene a pripravenému dopytu.",
        img: P + "live/derat.webp",
        tools: ["Kalkulačka ceny", "Dopytový asistent"],
        case: true,
        caseHref: "/postup",
      },
      {
        name: "Môj Plot",
        domain: "mojplot.sk",
        href: "https://mojplot.sk/",
        type: "E-shop · chatbot a kalkulačka",
        result: "Chatbot poradí s výberom plotu a kalkulačka spočíta cenu podľa dĺžky a výšky.",
        img: P + "live/mojplot.webp",
        tools: ["Chatbot", "Kalkulačka plotu"],
        case: false,
      },
      {
        name: "WEBKO",
        domain: "webko.sk",
        href: "https://www.webko.sk/",
        type: "Prezentačný web · získavanie dopytov",
        result: "Sebavedomá prezentácia služby s jasným smerovaním ku kontaktu.",
        img: P + "live/webko.webp",
        tools: ["Prezentačný web", "Cesta ku kontaktu"],
        case: false,
      },
    ].map((w, i) => ({
      ...w,
      ...themes[i],
      num: "0" + (i + 1),
      top: 100 + i * 22 + "px",
    }));

    return {
      heroCards: [
        {
          name: "Môj Plot",
          domain: "mojplot.sk",
          href: "https://mojplot.sk/",
          img: P + "live/mojplot.webp",
          left: "34%",
          top: "0px",
          rot: "4deg",
          z: 1,
          num: "03",
        },
        {
          name: "DERAT",
          domain: "derat.sk",
          href: "https://derat.sk/",
          img: P + "live/derat.webp",
          left: "0%",
          top: "22%",
          rot: "-3deg",
          z: 2,
          num: "02",
        },
        {
          name: "Koverta",
          domain: "koverta.sk",
          href: "https://koverta.sk/",
          img: P + "live/koverta.webp",
          left: "22%",
          top: "44%",
          rot: "1.5deg",
          z: 3,
          num: "01",
        },
      ],
      smallTools: [
        {
          num: "02",
          price: "OD 447 €",
          title: "Cenová kalkulačka",
          copy: "Z rozmeru, množstva či doplnkov spočíta orientačnú cenu.",
          img: P + "solutions/kalkulacka-derat.webp",
          w: "74%",
          href: "/nastroj?t=kalkulacka",
        },
        {
          num: "03",
          price: "OD 347 €",
          title: "Chatbot",
          copy: "Odpovedá z vašich podkladov a pošle vám kontakt so zhrnutím.",
          img: P + "solutions/chatbot-aplan.webp",
          w: "60%",
          href: "/nastroj?t=chatbot",
        },
        {
          num: "04",
          price: "OD 347 €",
          title: "Produktový poradca",
          copy: "Pár otázok a zákazník dostane konkrétny produkt z ponuky.",
          img: P + "solutions/poradca-kava.webp",
          w: "60%",
          href: "/nastroj?t=poradca",
        },
      ],
      combos: [
        { left: "Chatbot", right: "Kalkulačka", copy: "Odpovie na otázky a rovno spočíta cenu." },
        {
          left: "Chatbot",
          right: "Konfigurátor",
          copy: "Vysvetlí možnosti a prevedie celým výberom.",
        },
        { left: "Chatbot", right: "Poradca", copy: "Zistí potreby a odporučí konkrétny produkt." },
        {
          left: "Všetko",
          right: "spolu",
          copy: "Chatbot, kalkulačka, konfigurátor aj poradca v jednom nástroji.",
        },
      ],
      isBefore,
      isAfter: !isBefore,
      setBefore: () => this.setState({ ba: "before" }),
      setAfter: () => this.setState({ ba: "after" }),
      bBg: isBefore ? "#0C1A15" : "transparent",
      bColor: isBefore ? "#fff" : "#0E1512",
      aBg: !isBefore ? "#0C1A15" : "transparent",
      aColor: !isBefore ? "#fff" : "#0E1512",
      inquiry: [
        ["SLUŽBA", "Deratizácia"],
        ["PRIESTOR", "Byt v bytovom dome"],
        ["ROZLOHA", "60 m²"],
        ["LOKALITA", "Nitra"],
        ["ORIENTAČNÁ CENA", "od 60 € bez DPH"],
        ["KONTAKT", "Ján · 0905 …"],
      ].map(([k, v]) => ({ k, v })),
      kovTabs: kovShots.map((k, i) => {
        const a = i === this.state.kov;
        return {
          ...k,
          bg: a ? "#fff" : "transparent",
          color: a ? "#0C1A15" : "rgba(255,255,255,.75)",
          pick: () => this.setState({ kov: i }),
        };
      }),
      kovShot: kovShots[this.state.kov],
      kovSteps: [
        {
          num: "01",
          title: "Vyberie typ a umiestnenie",
          copy: "Samostatne, pri stene alebo v rohu.",
        },
        {
          num: "02",
          title: "Nastaví rozmer, farbu a strechu",
          copy: "Model aj cena sa menia okamžite.",
        },
        {
          num: "03",
          title: "Pošle dopyt so zostavou",
          copy: "Bez prepisovania rozmerov do e-mailu.",
        },
      ],
      work,
      steps: [
        {
          num: "01",
          title: "Ukážete nám web a ponuku",
          copy: "Zistíme, čo zákazníci najčastejšie hľadajú, riešia a pýtajú sa.",
          output: "Jasné zadanie",
        },
        {
          num: "02",
          title: "Navrhneme postup",
          copy: "Určíme, čo má zákazník vidieť, vybrať alebo vyplniť — a čo dostanete vy.",
          output: "Návrh logiky na schválenie",
        },
        {
          num: "03",
          title: "Postavíme a otestujeme",
          copy: "Dizajn, logika, ceny aj napojenia. Na počítači aj na mobile.",
          output: "Ukážka, ktorú si vyskúšate",
        },
        {
          num: "04",
          title: "Nasadíme na váš web",
          copy: "Bez prerábania celého webu. Overíme dopyty, formuláre aj bežné používanie.",
          output: "Spustené riešenie",
        },
      ],
      prices: [
        {
          num: "01",
          value: "347 €",
          tag: "Chatbot · produktový poradca",
          copy: "Návrh, dizajn, obsah, logika a nasadenie na web.",
          unit: "JEDNORAZOVO",
        },
        {
          num: "02",
          value: "447 €",
          tag: "Kalkulačka · konfigurátor",
          copy: "Výpočet alebo výber postavený na vašich pravidlách a ponuke.",
          unit: "JEDNORAZOVO",
        },
        {
          num: "03",
          value: "10 €",
          tag: "Technická prevádzka",
          copy: "Hosting riešenia a základná technická starostlivosť.",
          unit: "/ MESIAC",
        },
      ],
      faqs: [
        [
          "Od čoho závisí cena?",
          "Najmä od toho, koľko vecí má chatbot robiť. Jednoduché odpovede a zber kontaktov stoja menej než výpočet ceny, výber produktu, objednávky alebo prepojenie s firemným systémom. Presnú cenu dostanete vopred.",
        ],
        [
          "Čo odo mňa potrebujete na začiatku?",
          "Stačí odkaz na web, popis ponuky, najčastejšie otázky zákazníkov a informácia, kam majú chodiť dopyty alebo objednávky. Ostatné si prejdeme spolu.",
        ],
        [
          "Ako rýchlo môže byť chatbot na webe?",
          "Jednoduchšie riešenie vieme pripraviť v priebehu dní. Pri výpočtoch, veľkom výbere produktov alebo viacerých prepojeniach dostanete presný termín spolu s cenou ešte pred začiatkom.",
        ],
        [
          "Musím kvôli tomu prerábať celý web?",
          "Nie. Chatbot sa pridá na existujúci web a prispôsobí sa jeho farbám, písmu a štýlu. Vo väčšine prípadov netreba meniť ostatné časti stránky.",
        ],
        [
          "Z čoho chatbot odpovedá?",
          "Používa vaše texty, cenník, ponuku a pravidlá. Keď odpoveď nepozná alebo ide o citlivú otázku, nemá hádať — vypýta si kontakt alebo pošle otázku človeku.",
        ],
        [
          "Môžem si riešenie najprv vyskúšať?",
          "Áno. Najprv dostanete vlastnú ukážku. Vyskúšate si otázky, výber, výpočet aj výsledok a až potom sa riešenie pridá na váš web.",
        ],
      ].map(([q, a], i) => ({ q, a, num: "0" + (i + 1) })),
    };
  }
  render() {
    const {
      aBg,
      aColor,
      bBg,
      bColor,
      faqs,
      inquiry,
      isAfter,
      isBefore,
      kovShot,
      kovSteps,
      kovTabs,
      setAfter,
      setBefore,
      smallTools,
      steps,
      work,
    } = this.renderVals();
    return (
      <Fragment>
        <div
          style={cssStyle(
            `font-family:'Geist',system-ui,sans-serif;color:#0E1512;background:#F5F4EF`,
          )}
        >
          <div style={cssStyle(`position:sticky;top:0;z-index:50`)}></div>
          <StudioHero />
          <section
            style={cssStyle(
              `max-width:1280px;margin:0 auto;padding:0 32px 88px;box-sizing:border-box`,
            )}
          >
            <div
              style={cssStyle(
                `display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px`,
              )}
            >
              <div
                style={cssStyle(
                  `background:#C9F26B;border-radius:24px;padding:28px;display:flex;flex-direction:column;justify-content:space-between;min-height:250px;gap:24px`,
                )}
              >
                <div
                  style={cssStyle(
                    `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em`,
                  )}
                >
                  {"01 / ODPOVEĎ"}
                </div>
                <div>
                  <div
                    style={cssStyle(
                      `font-size:64px;font-weight:600;letter-spacing:-.05em;line-height:1`,
                    )}
                  >
                    {"1 deň"}
                  </div>
                  <div style={cssStyle(`font-size:15px;margin-top:10px;line-height:1.4`)}>
                    {"Ozveme sa s ďalším krokom, v pracovný deň."}
                  </div>
                </div>
              </div>
              <a
                href={sitePath("/cennik")}
                style={cssStyle(
                  `background:#fff;border:1px solid rgba(14,21,18,.12);border-radius:24px;padding:28px;display:flex;flex-direction:column;justify-content:space-between;gap:24px`,
                )}
                className="ref-hover-3"
              >
                <div
                  style={cssStyle(
                    `display:flex;justify-content:space-between;font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#5C645F`,
                  )}
                >
                  <span>{"02 / CHATBOT ALEBO PORADCA"}</span>
                  <span>{"↗"}</span>
                </div>
                <div>
                  <div style={cssStyle(`font-size:15px;color:#5C645F`)}>{"od"}</div>
                  <div
                    style={cssStyle(
                      `font-size:64px;font-weight:600;letter-spacing:-.05em;line-height:1;font-variant-numeric:tabular-nums`,
                    )}
                  >
                    {"347 €"}
                  </div>
                  <div style={cssStyle(`font-size:15px;color:#5C645F;margin-top:10px`)}>
                    {"Návrh, obsah, logika a nasadenie."}
                  </div>
                </div>
              </a>
              <a
                href={sitePath("/cennik")}
                style={cssStyle(
                  `background:#fff;border:1px solid rgba(14,21,18,.12);border-radius:24px;padding:28px;display:flex;flex-direction:column;justify-content:space-between;gap:24px`,
                )}
                className="ref-hover-4"
              >
                <div
                  style={cssStyle(
                    `display:flex;justify-content:space-between;font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#5C645F`,
                  )}
                >
                  <span>{"03 / KALKULAČKA · KONFIGURÁTOR"}</span>
                  <span>{"↗"}</span>
                </div>
                <div>
                  <div style={cssStyle(`font-size:15px;color:#5C645F`)}>{"od"}</div>
                  <div
                    style={cssStyle(
                      `font-size:64px;font-weight:600;letter-spacing:-.05em;line-height:1;font-variant-numeric:tabular-nums`,
                    )}
                  >
                    {"447 €"}
                  </div>
                  <div style={cssStyle(`font-size:15px;color:#5C645F;margin-top:10px`)}>
                    {"Postavené na vašich pravidlách."}
                  </div>
                </div>
              </a>
              <div
                style={cssStyle(
                  `background:#0C1A15;color:#fff;border-radius:24px;padding:28px;display:flex;flex-direction:column;justify-content:space-between;gap:24px`,
                )}
              >
                <div
                  style={cssStyle(
                    `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#C9F26B`,
                  )}
                >
                  {"04 / UKÁŽKA"}
                </div>
                <div>
                  <div
                    style={cssStyle(
                      `font-size:30px;font-weight:600;letter-spacing:-.03em;line-height:1.1`,
                    )}
                  >
                    {"Vyskúšate si ju vopred."}
                  </div>
                  <div
                    style={cssStyle(`font-size:15px;color:rgba(255,255,255,.7);margin-top:10px`)}
                  >
                    {"Na web ide až to, čo schválite."}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section
            id={"riesenia"}
            style={cssStyle(
              `max-width:1280px;margin:0 auto;padding:0 32px 88px;box-sizing:border-box;display:flex;flex-direction:column;gap:48px`,
            )}
          >
            <div
              style={cssStyle(
                `display:flex;justify-content:space-between;align-items:end;gap:24px 32px;flex-wrap:wrap;padding-top:28px;border-top:1px solid rgba(14,21,18,.12)`,
              )}
            >
              <div>
                <div
                  style={cssStyle(
                    `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#5C645F`,
                  )}
                >
                  {"01 / RIEŠENIA"}
                </div>
                <h2
                  style={cssStyle(
                    `margin:16px 0 0;font-size:clamp(44px,5.5vw,68px);line-height:1.04;letter-spacing:-.045em;font-weight:600`,
                  )}
                >
                  {"Aké riešenie"}
                  <br />
                  {"potrebujete?"}
                </h2>
              </div>
              <p
                style={cssStyle(
                  `margin:0;font-size:18px;line-height:1.5;color:#5C645F;max-width:380px`,
                )}
              >
                {"Každý nástroj funguje samostatne, v kombinácii aj všetky spolu v jednom."}
              </p>
            </div>
            <div
              style={cssStyle(
                `display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:12px`,
              )}
            >
              <a
                href={sitePath("/3d-konfigurator")}
                data-cursor={"3D"}
                style={cssStyle(
                  `grid-column:1/-1;background:#0C1A15;color:#fff;border-radius:28px;overflow:hidden;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))`,
                )}
              >
                <div
                  style={cssStyle(
                    `height:clamp(280px,44vh,380px);overflow:hidden;position:relative`,
                  )}
                >
                  <span
                    style={cssStyle(
                      `position:absolute;left:16px;top:16px;z-index:1;background:rgba(255,255,255,.92);color:#0C1A15;padding:8px 12px;border-radius:999px;font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.08em`,
                    )}
                  >
                    {"ŽIVÝ KONFIGURÁTOR · SOLTEC"}
                  </span>
                  <img
                    src={sitePath("/work/koverta/realizacia-pergola-sibenik.webp")}
                    alt={"Realizácia Koverta: bioklimatická pergola nad terasou"}
                    style={cssStyle(
                      `width:100%;height:100%;object-fit:cover;object-position:30% center;display:block;background:#fff`,
                    )}
                    loading="eager"
                  />
                </div>
                <div
                  style={cssStyle(
                    `padding:36px;display:flex;flex-direction:column;justify-content:space-between;gap:32px`,
                  )}
                >
                  <div
                    style={cssStyle(
                      `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#C9F26B`,
                    )}
                  >
                    {"01 / 3D KONFIGURÁTOR · PODĽA ROZSAHU"}
                  </div>
                  <div>
                    <div
                      style={cssStyle(
                        `font-size:40px;font-weight:600;letter-spacing:-.035em;line-height:1.05`,
                      )}
                    >
                      {"Produkt si zákazník poskladá v 3D."}
                    </div>
                    <div
                      style={cssStyle(
                        `font-size:17px;color:rgba(255,255,255,.7);margin-top:14px;line-height:1.5`,
                      )}
                    >
                      {"Každá voľba sa hneď prepíše do modelu aj do ceny."}
                    </div>
                  </div>
                  <span
                    style={cssStyle(
                      `align-self:flex-start;background:#C9F26B;color:#0C1A15;font-weight:600;font-size:15px;padding:13px 20px;border-radius:999px`,
                    )}
                  >
                    {"Pozrieť 3D konfigurátor ↗"}
                  </span>
                </div>
              </a>
              {smallTools.map((t, index) => (
                <Fragment key={index}>
                  <a
                    href={sitePath(t.href)}
                    data-cursor={"Viac"}
                    style={cssStyle(
                      `background:#fff;border:1px solid rgba(14,21,18,.12);border-radius:28px;overflow:hidden;display:flex;flex-direction:column`,
                    )}
                    className="ref-hover-5"
                  >
                    <div
                      style={cssStyle(
                        `height:220px;background:#ECEAE3;display:flex;justify-content:center;overflow:hidden`,
                      )}
                    >
                      <img
                        src={sitePath(t.img)}
                        alt={t.title}
                        style={cssStyle(
                          `width:${t.w};margin-top:28px;border-radius:14px;align-self:flex-start`,
                        )}
                        loading="eager"
                      />
                    </div>
                    <div
                      style={cssStyle(
                        `padding:24px 26px;display:flex;flex-direction:column;gap:8px`,
                      )}
                    >
                      <div
                        style={cssStyle(
                          `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#5C645F`,
                        )}
                      >
                        {t.num}
                        {" / "}
                        {t.price}
                      </div>
                      <div
                        style={cssStyle(`font-size:24px;font-weight:600;letter-spacing:-.025em`)}
                      >
                        {t.title}
                      </div>
                      <div style={cssStyle(`font-size:15px;color:#5C645F;line-height:1.5`)}>
                        {t.copy}
                      </div>
                    </div>
                  </a>
                </Fragment>
              ))}
            </div>
            <div style={cssStyle(`display:flex;flex-direction:column;gap:12px`)}>
              <div
                style={cssStyle(
                  `background:#C9F26B;color:#0C1A15;border-radius:24px;padding:28px 32px;display:flex;justify-content:space-between;align-items:center;gap:24px 40px;flex-wrap:wrap`,
                )}
              >
                <div style={cssStyle(`display:flex;flex-direction:column;gap:12px`)}>
                  <div
                    style={cssStyle(
                      `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em`,
                    )}
                  >
                    {"KOMBINÁCIE"}
                  </div>
                  <h3
                    style={cssStyle(
                      `margin:0;font-size:clamp(32px,3.8vw,46px);line-height:1.04;letter-spacing:-.045em;font-weight:600`,
                    )}
                  >
                    {"Nemusí to byť iba jedno riešenie."}
                  </h3>
                  <p style={cssStyle(`margin:0;font-size:16px;line-height:1.5;max-width:440px`)}>
                    {
                      "Nástroje spojíme po dvoch aj všetky naraz — zákazník necíti prechod medzi nimi."
                    }
                  </p>
                </div>
                <div style={cssStyle(`display:flex;align-items:center;gap:16px`)}>
                  <div style={cssStyle(`display:flex`)}>
                    <span
                      style={cssStyle(
                        `width:60px;height:60px;border-radius:50%;background:#0C1A15;color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;border:3px solid #C9F26B`,
                      )}
                    >
                      {"Ch"}
                    </span>
                    <span
                      style={cssStyle(
                        `width:60px;height:60px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;margin-left:-16px;border:3px solid #C9F26B`,
                      )}
                    >
                      {"Ka"}
                    </span>
                    <span
                      style={cssStyle(
                        `width:60px;height:60px;border-radius:50%;background:#1F5B47;color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;margin-left:-16px;border:3px solid #C9F26B`,
                      )}
                    >
                      {"3D"}
                    </span>
                    <span
                      style={cssStyle(
                        `width:60px;height:60px;border-radius:50%;background:#F5F4EF;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;margin-left:-16px;border:3px solid #C9F26B`,
                      )}
                    >
                      {"Po"}
                    </span>
                  </div>
                  <a
                    href={sitePath("/sluzby")}
                    style={cssStyle(
                      `background:#0C1A15;color:#fff;font-weight:600;font-size:14px;padding:12px 18px;border-radius:999px;white-space:nowrap`,
                    )}
                  >
                    {"Všetky kombinácie →"}
                  </a>
                </div>
              </div>
              <div
                style={cssStyle(
                  `display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:12px`,
                )}
              >
                <a
                  href={sitePath("/sluzby")}
                  style={cssStyle(
                    `background:#fff;border:1px solid rgba(14,21,18,.12);border-radius:24px;padding:16px;display:flex;flex-direction:column;gap:20px`,
                  )}
                  className="ref-hover-6"
                >
                  <div
                    style={cssStyle(
                      `background:#ECEAE3;border-radius:16px;padding:18px;display:flex;flex-direction:column;gap:10px;height:200px;box-sizing:border-box;justify-content:center`,
                    )}
                  >
                    <div
                      style={cssStyle(
                        `align-self:flex-end;background:#0C1A15;color:#fff;border-radius:14px 14px 4px 14px;padding:9px 12px;font-size:13px;max-width:80%`,
                      )}
                    >
                      {"Koľko stojí deratizácia bytu?"}
                    </div>
                    <div
                      style={cssStyle(
                        `align-self:flex-start;background:#fff;border-radius:14px 14px 14px 4px;padding:9px 12px;font-size:13px;max-width:80%`,
                      )}
                    >
                      {"Spočítam vám to. Aká je rozloha?"}
                    </div>
                    <div
                      style={cssStyle(
                        `align-self:flex-start;display:flex;gap:8px;align-items:center;background:#fff;border:1px solid rgba(14,21,18,.1);border-radius:12px;padding:8px 10px`,
                      )}
                    >
                      <span
                        style={cssStyle(
                          `font-family:'Geist Mono',monospace;font-size:10px;letter-spacing:.08em;color:#5C645F`,
                        )}
                      >
                        {"BYT · 60 M²"}
                      </span>
                      <span
                        style={cssStyle(
                          `background:#C9F26B;border-radius:999px;padding:4px 9px;font-size:12px;font-weight:600`,
                        )}
                      >
                        {"od 60 € bez DPH"}
                      </span>
                    </div>
                  </div>
                  <div
                    style={cssStyle(`padding:0 8px 8px;display:flex;flex-direction:column;gap:6px`)}
                  >
                    <div
                      style={cssStyle(
                        `display:flex;justify-content:space-between;align-items:center`,
                      )}
                    >
                      <span
                        style={cssStyle(`font-size:21px;font-weight:600;letter-spacing:-.02em`)}
                      >
                        {"Chatbot + kalkulačka"}
                      </span>
                      <span>{"↗"}</span>
                    </div>
                    <span style={cssStyle(`font-size:14px;color:#5C645F;line-height:1.45`)}>
                      {"Odpovie na otázky a rovno spočíta cenu."}
                    </span>
                  </div>
                </a>
                <a
                  href={sitePath("/3d-konfigurator")}
                  style={cssStyle(
                    `background:#fff;border:1px solid rgba(14,21,18,.12);border-radius:24px;padding:16px;display:flex;flex-direction:column;gap:20px`,
                  )}
                  className="ref-hover-7"
                >
                  <div
                    style={cssStyle(
                      `position:relative;border-radius:16px;overflow:hidden;height:200px;background:#ECEAE3`,
                    )}
                  >
                    <img
                      src={sitePath("/work/koverta/realizacia-pergola-sibenik.webp")}
                      alt={""}
                      style={cssStyle(`width:100%;height:100%;object-fit:cover;display:block`)}
                      loading="lazy"
                    />
                    <div
                      style={cssStyle(
                        `position:absolute;left:12px;top:12px;background:#0C1A15;color:#fff;border-radius:14px 14px 14px 4px;padding:9px 12px;font-size:13px;max-width:70%`,
                      )}
                    >
                      {"Zmestí sa mi to k domu?"}
                    </div>
                    <div
                      style={cssStyle(
                        `position:absolute;right:12px;bottom:12px;display:flex;gap:6px`,
                      )}
                    >
                      <span
                        style={cssStyle(
                          `background:#fff;border-radius:999px;padding:5px 10px;font-family:'Geist Mono',monospace;font-size:10px;letter-spacing:.06em`,
                        )}
                      >
                        {"PRI STENE"}
                      </span>
                      <span
                        style={cssStyle(
                          `background:#C9F26B;border-radius:999px;padding:5px 10px;font-family:'Geist Mono',monospace;font-size:10px;letter-spacing:.06em`,
                        )}
                      >
                        {"3D"}
                      </span>
                    </div>
                  </div>
                  <div
                    style={cssStyle(`padding:0 8px 8px;display:flex;flex-direction:column;gap:6px`)}
                  >
                    <div
                      style={cssStyle(
                        `display:flex;justify-content:space-between;align-items:center`,
                      )}
                    >
                      <span
                        style={cssStyle(`font-size:21px;font-weight:600;letter-spacing:-.02em`)}
                      >
                        {"Chatbot + konfigurátor"}
                      </span>
                      <span>{"↗"}</span>
                    </div>
                    <span style={cssStyle(`font-size:14px;color:#5C645F;line-height:1.45`)}>
                      {"Vysvetlí možnosti a prevedie celým výberom."}
                    </span>
                  </div>
                </a>
                <a
                  href={sitePath("/sluzby")}
                  style={cssStyle(
                    `background:#fff;border:1px solid rgba(14,21,18,.12);border-radius:24px;padding:16px;display:flex;flex-direction:column;gap:20px`,
                  )}
                  className="ref-hover-8"
                >
                  <div
                    style={cssStyle(
                      `background:#ECEAE3;border-radius:16px;padding:18px;display:grid;grid-template-columns:1fr 92px;gap:12px;height:200px;box-sizing:border-box;align-items:center`,
                    )}
                  >
                    <div style={cssStyle(`display:flex;flex-direction:column;gap:8px`)}>
                      <div
                        style={cssStyle(
                          `background:#0C1A15;color:#fff;border-radius:14px 14px 14px 4px;padding:9px 12px;font-size:13px`,
                        )}
                      >
                        {"Akú chuť máte radi?"}
                      </div>
                      <div style={cssStyle(`display:flex;gap:6px;flex-wrap:wrap`)}>
                        <span
                          style={cssStyle(
                            `background:#C9F26B;border-radius:999px;padding:5px 10px;font-size:12px;font-weight:500`,
                          )}
                        >
                          {"Jemná"}
                        </span>
                        <span
                          style={cssStyle(
                            `background:#fff;border-radius:999px;padding:5px 10px;font-size:12px`,
                          )}
                        >
                          {"S mliekom"}
                        </span>
                      </div>
                    </div>
                    <div
                      style={cssStyle(
                        `height:164px;border-radius:12px;overflow:hidden;background:#fff`,
                      )}
                    >
                      <img
                        src={sitePath("/work/solutions/poradca-kava.webp")}
                        alt={""}
                        style={cssStyle(`width:100%;display:block`)}
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div
                    style={cssStyle(`padding:0 8px 8px;display:flex;flex-direction:column;gap:6px`)}
                  >
                    <div
                      style={cssStyle(
                        `display:flex;justify-content:space-between;align-items:center`,
                      )}
                    >
                      <span
                        style={cssStyle(`font-size:21px;font-weight:600;letter-spacing:-.02em`)}
                      >
                        {"Chatbot + poradca"}
                      </span>
                      <span>{"↗"}</span>
                    </div>
                    <span style={cssStyle(`font-size:14px;color:#5C645F;line-height:1.45`)}>
                      {"Zistí potreby a odporučí konkrétny produkt."}
                    </span>
                  </div>
                </a>
                <a
                  href={sitePath("/sluzby")}
                  style={cssStyle(
                    `grid-column:1/-1;background:#0C1A15;color:#fff;border-radius:24px;padding:28px 32px;display:flex;align-items:center;justify-content:space-between;gap:24px 40px;flex-wrap:wrap`,
                  )}
                >
                  <div
                    style={cssStyle(`display:flex;flex-direction:column;gap:6px;max-width:380px`)}
                  >
                    <span
                      style={cssStyle(
                        `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#C9F26B`,
                      )}
                    >
                      {"VŠETKO SPOLU"}
                    </span>
                    <span style={cssStyle(`font-size:26px;font-weight:600;letter-spacing:-.025em`)}>
                      {"Štyri nástroje, jeden dopyt."}
                    </span>
                    <span
                      style={cssStyle(`font-size:14px;color:rgba(255,255,255,.7);line-height:1.45`)}
                    >
                      {"Chatbot, poradca, konfigurátor aj kalkulačka v jednom rozhraní."}
                    </span>
                  </div>
                  <div style={cssStyle(`display:flex;align-items:center;gap:8px;flex-wrap:wrap`)}>
                    <span
                      style={cssStyle(
                        `padding:10px 14px;border-radius:12px;background:rgba(255,255,255,.08);font-size:14px`,
                      )}
                    >
                      {"Chatbot odpovie"}
                    </span>
                    <span style={cssStyle(`color:rgba(255,255,255,.4)`)}>{"→"}</span>
                    <span
                      style={cssStyle(
                        `padding:10px 14px;border-radius:12px;background:rgba(255,255,255,.08);font-size:14px`,
                      )}
                    >
                      {"Poradca odporučí"}
                    </span>
                    <span style={cssStyle(`color:rgba(255,255,255,.4)`)}>{"→"}</span>
                    <span
                      style={cssStyle(
                        `padding:10px 14px;border-radius:12px;background:rgba(255,255,255,.08);font-size:14px`,
                      )}
                    >
                      {"3D zostava"}
                    </span>
                    <span style={cssStyle(`color:rgba(255,255,255,.4)`)}>{"→"}</span>
                    <span
                      style={cssStyle(
                        `padding:10px 14px;border-radius:12px;background:rgba(255,255,255,.08);font-size:14px`,
                      )}
                    >
                      {"Cena"}
                    </span>
                    <span style={cssStyle(`color:rgba(255,255,255,.4)`)}>{"→"}</span>
                    <span
                      style={cssStyle(
                        `padding:10px 14px;border-radius:12px;background:#C9F26B;color:#0C1A15;font-size:14px;font-weight:600`,
                      )}
                    >
                      {"Jeden dopyt"}
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </section>
          <section
            style={cssStyle(
              `background:#fff;border-top:1px solid rgba(14,21,18,.12);border-bottom:1px solid rgba(14,21,18,.12)`,
            )}
          >
            <div
              style={cssStyle(
                `max-width:1280px;margin:0 auto;padding:88px 32px;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;gap:36px`,
              )}
            >
              <div
                style={cssStyle(
                  `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#5C645F`,
                )}
              >
                {"02 / PRED A PO"}
              </div>
              <h2
                style={cssStyle(
                  `margin:0;font-size:clamp(44px,5.5vw,68px);line-height:1;letter-spacing:-.045em;font-weight:600;text-align:center`,
                )}
              >
                {"Rovnaký zákazník."}
                <br />
                <span style={cssStyle(`color:#1F5B47`)}>{"Úplne iný dopyt."}</span>
              </h2>
              <div
                style={cssStyle(
                  `display:flex;background:#F5F4EF;border-radius:999px;padding:5px;border:1px solid rgba(14,21,18,.12)`,
                )}
              >
                <button
                  onClick={setBefore}
                  style={cssStyle(
                    `all:unset;cursor:pointer;padding:12px 26px;border-radius:999px;font-size:16px;font-weight:500;background:${bBg};color:${bColor}`,
                  )}
                  type="button"
                >
                  {"Bez nástroja"}
                </button>
                <button
                  onClick={setAfter}
                  style={cssStyle(
                    `all:unset;cursor:pointer;padding:12px 26px;border-radius:999px;font-size:16px;font-weight:500;background:${aBg};color:${aColor}`,
                  )}
                  type="button"
                >
                  {"S kalkulačkou"}
                </button>
              </div>
              <div
                style={cssStyle(
                  `width:100%;max-width:780px;min-height:360px;border-radius:28px;border:1px solid rgba(14,21,18,.12);background:#F5F4EF;padding:36px;box-sizing:border-box`,
                )}
              >
                {isBefore ? (
                  <Fragment>
                    <div style={cssStyle(`display:flex;flex-direction:column;gap:14px`)}>
                      <div
                        style={cssStyle(
                          `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#5C645F;margin-bottom:6px`,
                        )}
                      >
                        {"E-MAIL · JAN.K…@GMAIL.COM"}
                      </div>
                      <div
                        style={cssStyle(
                          `align-self:flex-start;max-width:72%;background:#fff;border-radius:18px 18px 18px 4px;padding:14px 18px;font-size:17px`,
                        )}
                      >
                        {"Dobrý deň, koľko by stála deratizácia?"}
                      </div>
                      <div
                        style={cssStyle(
                          `align-self:flex-end;max-width:72%;background:#0C1A15;color:#fff;border-radius:18px 18px 4px 18px;padding:14px 18px;font-size:17px`,
                        )}
                      >
                        {"Aký je to priestor a koľko m²?"}
                      </div>
                      <div
                        style={cssStyle(
                          `align-self:flex-start;max-width:72%;background:#fff;border-radius:18px 18px 18px 4px;padding:14px 18px;font-size:17px`,
                        )}
                      >
                        {"Byt, neviem presne… asi 60?"}
                      </div>
                      <div
                        style={cssStyle(
                          `align-self:flex-end;max-width:72%;background:#0C1A15;color:#fff;border-radius:18px 18px 4px 18px;padding:14px 18px;font-size:17px`,
                        )}
                      >
                        {"A o akého škodcu ide? Kde sa nachádzate?"}
                      </div>
                      <div
                        style={cssStyle(
                          `margin-top:14px;padding-top:18px;border-top:1px solid rgba(14,21,18,.12);font-size:15px;line-height:1.5`,
                        )}
                      >
                        <strong>{"Ďalšie e-maily a telefonáty."}</strong>
                        <span style={cssStyle(`color:#5C645F`)}>
                          {"Zákazník medzitým často píše aj konkurencii."}
                        </span>
                      </div>
                    </div>
                  </Fragment>
                ) : null}
                {isAfter ? (
                  <Fragment>
                    <div style={cssStyle(`display:flex;flex-direction:column;gap:18px`)}>
                      <div
                        style={cssStyle(
                          `display:flex;justify-content:space-between;align-items:center`,
                        )}
                      >
                        <span
                          style={cssStyle(
                            `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#5C645F`,
                          )}
                        >
                          {"NOVÝ DOPYT · DERAT.SK"}
                        </span>
                        <span
                          style={cssStyle(
                            `background:#C9F26B;padding:7px 12px;border-radius:999px;font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.08em`,
                          )}
                        >
                          {"KOMPLETNÝ"}
                        </span>
                      </div>
                      <div
                        style={cssStyle(
                          `display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px`,
                        )}
                      >
                        {inquiry.map((r, index) => (
                          <Fragment key={index}>
                            <div
                              style={cssStyle(
                                `background:#fff;border-radius:14px;padding:14px 16px;border:1px solid rgba(14,21,18,.08)`,
                              )}
                            >
                              <div
                                style={cssStyle(
                                  `font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.08em;color:#5C645F`,
                                )}
                              >
                                {r.k}
                              </div>
                              <div
                                style={cssStyle(`font-size:17px;font-weight:500;margin-top:4px`)}
                              >
                                {r.v}
                              </div>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                      <div
                        style={cssStyle(
                          `padding-top:18px;border-top:1px solid rgba(14,21,18,.12);font-size:15px;line-height:1.5`,
                        )}
                      >
                        <strong>{"Viete rovno poslať ponuku."}</strong>
                        <span style={cssStyle(`color:#5C645F`)}>
                          {"Zákazník pozná orientačnú cenu, vy rozsah práce."}
                        </span>
                      </div>
                    </div>
                  </Fragment>
                ) : null}
              </div>
            </div>
          </section>
          <section id={"koverta"} style={cssStyle(`background:#0C1A15;color:#fff`)}>
            <div
              style={cssStyle(
                `max-width:1280px;margin:0 auto;padding:88px 32px;box-sizing:border-box;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.55fr);gap:48px;align-items:center`,
              )}
            >
              <div
                style={cssStyle(
                  `display:flex;flex-direction:column;gap:28px;padding-top:28px;border-top:1px solid rgba(255,255,255,.12)`,
                )}
              >
                <div
                  style={cssStyle(
                    `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#C9F26B`,
                  )}
                >
                  {"03 / REALIZÁCIA · KOVERTA.SK"}
                </div>
                <h2
                  style={cssStyle(
                    `margin:0;font-size:clamp(36px,4vw,52px);line-height:1.04;letter-spacing:-.045em;font-weight:600`,
                  )}
                >
                  {"Prístrešok si zákazník poskladá v 3D."}
                </h2>
                <p
                  style={cssStyle(
                    `margin:0;font-size:17px;line-height:1.5;color:rgba(255,255,255,.72)`,
                  )}
                >
                  {
                    "Každá voľba sa hneď prepíše do 3D modelu aj do orientačnej ceny. Firma dostane dopyt, v ktorom už je všetko podstatné."
                  }
                </p>
                <div style={cssStyle(`display:flex;flex-direction:column`)}>
                  {kovSteps.map((s, index) => (
                    <Fragment key={index}>
                      <div
                        style={cssStyle(
                          `display:grid;grid-template-columns:40px minmax(0,1fr);gap:12px;padding:14px 0;border-top:1px solid rgba(255,255,255,.12)`,
                        )}
                      >
                        <span
                          style={cssStyle(
                            `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#C9F26B;padding-top:4px`,
                          )}
                        >
                          {s.num}
                        </span>
                        <div>
                          <div style={cssStyle(`font-size:17px;font-weight:600`)}>{s.title}</div>
                          <div
                            style={cssStyle(
                              `font-size:14px;color:rgba(255,255,255,.65);margin-top:2px`,
                            )}
                          >
                            {s.copy}
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <a
                  href={sitePath("https://koverta.sk/pages/konfigurator")}
                  target={"_blank"}
                  rel={"noreferrer"}
                  style={cssStyle(
                    `align-self:flex-start;color:#fff;font-size:15px;border-bottom:1px solid rgba(255,255,255,.4);padding-bottom:3px`,
                  )}
                >
                  {"Otvoriť na koverta.sk ↗"}
                </a>
              </div>
              <div
                style={cssStyle(
                  `display:flex;flex-direction:column;gap:14px;grid-column:span 1;min-width:0`,
                )}
              >
                <div
                  style={cssStyle(
                    `display:flex;gap:4px;background:rgba(255,255,255,.06);padding:5px;border-radius:999px;flex-wrap:wrap;align-self:flex-start`,
                  )}
                >
                  {kovTabs.map((k, index) => (
                    <Fragment key={index}>
                      <button
                        onClick={k.pick}
                        style={cssStyle(
                          `all:unset;cursor:pointer;padding:10px 18px;border-radius:999px;font-size:14px;background:${k.bg};color:${k.color}`,
                        )}
                        type="button"
                      >
                        {k.label}
                      </button>
                    </Fragment>
                  ))}
                </div>
                <div
                  style={cssStyle(
                    `position:relative;border-radius:24px;overflow:hidden;height:clamp(300px,56vh,480px);background:#13261F`,
                  )}
                >
                  <img
                    src={sitePath(kovShot.img)}
                    alt={kovShot.label}
                    style={cssStyle(
                      `width:100%;height:100%;object-fit:${kovShot.fit};display:block`,
                    )}
                    loading="lazy"
                  />
                  <a
                    href={sitePath(
                      "https://danielvendzur-code.github.io/koverta-web/konfigurator/",
                    )}
                    target={"_blank"}
                    rel={"noreferrer"}
                    data-cursor={"Spustiť"}
                    style={cssStyle(
                      `position:absolute;right:16px;bottom:16px;background:#C9F26B;color:#0C1A15;font-weight:600;font-size:14px;padding:12px 18px;border-radius:999px`,
                    )}
                  >
                    {"Spustiť živý konfigurátor ↗"}
                  </a>
                </div>
              </div>
            </div>
          </section>
          <section
            id={"realizacie"}
            style={cssStyle(
              `max-width:1280px;margin:0 auto;padding:88px 32px 64px;box-sizing:border-box;display:flex;flex-direction:column;gap:48px`,
            )}
          >
            <div
              style={cssStyle(
                `display:flex;justify-content:space-between;align-items:end;gap:24px 32px;flex-wrap:wrap;padding-top:28px;border-top:1px solid rgba(14,21,18,.12)`,
              )}
            >
              <div>
                <div
                  style={cssStyle(
                    `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#5C645F`,
                  )}
                >
                  {"04 / REALIZÁCIE"}
                </div>
                <h2
                  style={cssStyle(
                    `margin:16px 0 0;font-size:clamp(44px,5.5vw,68px);line-height:1.04;letter-spacing:-.045em;font-weight:600`,
                  )}
                >
                  {"Hotové projekty."}
                  <br />
                  {"Skutočné výsledky."}
                </h2>
              </div>
              <a
                href={sitePath("/projekty")}
                style={cssStyle(
                  `font-size:15px;padding:13px 20px;border:1px solid rgba(14,21,18,.2);border-radius:999px`,
                )}
                className="ref-hover-9"
              >
                {"Všetky realizácie →"}
              </a>
            </div>
            <ol
              style={cssStyle(
                `list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:32px`,
              )}
            >
              {work.map((w, index) => (
                <Fragment key={index}>
                  <li style={cssStyle(`position:sticky;top:${w.top}`)}>
                    <article
                      style={cssStyle(
                        `background:${w.bg};color:${w.fg};border:1px solid ${w.line};border-radius:28px;padding:20px;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:clamp(16px,3vw,32px);box-shadow:0 -24px 48px -32px rgba(12,26,21,.25);height:min(470px,calc(100vh - 190px));box-sizing:border-box;overflow:hidden`,
                      )}
                    >
                      <a
                        href={sitePath(w.href)}
                        target={"_blank"}
                        rel={"noreferrer"}
                        data-cursor={"Otvoriť web"}
                        style={cssStyle(
                          `border-radius:18px;overflow:hidden;border:1px solid ${w.line};background:#fff;align-self:stretch;display:flex;flex-direction:column`,
                        )}
                      >
                        <div
                          style={cssStyle(
                            `display:flex;justify-content:space-between;align-items:center;padding:11px 14px;border-bottom:1px solid rgba(14,21,18,.08);color:#5C645F`,
                          )}
                        >
                          <span style={cssStyle(`display:flex;gap:5px`)}>
                            <span
                              style={cssStyle(
                                `width:9px;height:9px;border-radius:50%;background:rgba(14,21,18,.15)`,
                              )}
                            ></span>
                            <span
                              style={cssStyle(
                                `width:9px;height:9px;border-radius:50%;background:rgba(14,21,18,.15)`,
                              )}
                            ></span>
                            <span
                              style={cssStyle(
                                `width:9px;height:9px;border-radius:50%;background:rgba(14,21,18,.15)`,
                              )}
                            ></span>
                          </span>
                          <span
                            style={cssStyle(`font-family:'Geist Mono',monospace;font-size:12px`)}
                          >
                            {w.domain}
                            {" ↗"}
                          </span>
                        </div>
                        <img
                          src={sitePath(w.img)}
                          alt={w.name}
                          style={cssStyle(
                            `width:100%;flex:1;min-height:0;object-fit:cover;object-position:top;display:block`,
                          )}
                          loading="lazy"
                        />
                      </a>
                      <div
                        style={cssStyle(
                          `display:flex;flex-direction:column;justify-content:space-between;gap:28px;padding:16px 16px 16px 0`,
                        )}
                      >
                        <div style={cssStyle(`display:flex;flex-direction:column;gap:16px`)}>
                          <div
                            style={cssStyle(
                              `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:${w.muted}`,
                            )}
                          >
                            {w.num}
                            {" / "}
                            {w.type}
                          </div>
                          <h3
                            style={cssStyle(
                              `margin:0;font-size:clamp(30px,3.8vw,48px);line-height:1.04;letter-spacing:-.045em;font-weight:600`,
                            )}
                          >
                            {w.name}
                          </h3>
                          <p
                            style={cssStyle(
                              `margin:0;font-size:clamp(15px,1.5vw,18px);line-height:1.5;color:${w.muted};text-wrap:pretty`,
                            )}
                          >
                            {w.result}
                          </p>
                        </div>
                        <div style={cssStyle(`display:flex;flex-direction:column;gap:20px`)}>
                          <div style={cssStyle(`display:flex;gap:8px;flex-wrap:wrap`)}>
                            {w.tools.map((tg, index) => (
                              <Fragment key={index}>
                                <span
                                  style={cssStyle(
                                    `border:1px solid ${w.line};padding:8px 14px;border-radius:999px;font-size:13px`,
                                  )}
                                >
                                  {tg}
                                </span>
                              </Fragment>
                            ))}
                          </div>
                          <div
                            style={cssStyle(
                              `display:flex;gap:16px;align-items:center;padding-top:20px;border-top:1px solid ${w.line}`,
                            )}
                          >
                            <a
                              href={sitePath(w.href)}
                              target={"_blank"}
                              rel={"noreferrer"}
                              style={cssStyle(
                                `background:${w.btnBg};color:${w.btnFg};font-weight:600;font-size:15px;padding:13px 20px;border-radius:999px`,
                              )}
                            >
                              {w.domain}
                              {" ↗"}
                            </a>
                            {w.case ? (
                              <Fragment>
                                <a
                                  href={sitePath(w.caseHref)}
                                  style={cssStyle(
                                    `font-size:15px;border-bottom:1px solid currentColor;padding-bottom:2px`,
                                  )}
                                >
                                  {"Ako to funguje →"}
                                </a>
                              </Fragment>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </article>
                  </li>
                </Fragment>
              ))}
            </ol>
          </section>
          <section id={"postup"} style={cssStyle(`background:#0C1A15;color:#fff`)}>
            <div
              style={cssStyle(
                `max-width:1280px;margin:0 auto;padding:88px 32px;box-sizing:border-box;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr));gap:56px`,
              )}
            >
              <div
                style={cssStyle(
                  `display:flex;flex-direction:column;gap:20px;position:sticky;top:120px;align-self:start;padding-top:28px;border-top:1px solid rgba(255,255,255,.12)`,
                )}
              >
                <div
                  style={cssStyle(
                    `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#C9F26B`,
                  )}
                >
                  {"05 / AKO TO PREBIEHA"}
                </div>
                <h2
                  style={cssStyle(
                    `margin:0;font-size:clamp(44px,5vw,60px);line-height:1.04;letter-spacing:-.045em;font-weight:600`,
                  )}
                >
                  {"Od prvého rozhovoru po spustenie na webe."}
                </h2>
                <p
                  style={cssStyle(
                    `margin:0;font-size:17px;line-height:1.5;color:rgba(255,255,255,.7)`,
                  )}
                >
                  {"Viete, čo sa deje v každom kroku. Ukážku si vyskúšate ešte pred nasadením."}
                </p>
                <a
                  href={sitePath("/postup")}
                  style={cssStyle(
                    `align-self:flex-start;margin-top:12px;background:#C9F26B;color:#0C1A15;font-weight:600;font-size:15px;padding:14px 22px;border-radius:999px`,
                  )}
                >
                  {"Celý postup →"}
                </a>
              </div>
              <div style={cssStyle(`display:flex;flex-direction:column`)}>
                {steps.map((s, index) => (
                  <Fragment key={index}>
                    <div
                      style={cssStyle(
                        `display:grid;grid-template-columns:110px minmax(0,1fr);gap:24px;padding:32px 0;border-top:1px solid rgba(255,255,255,.12)`,
                      )}
                    >
                      <span
                        style={cssStyle(
                          `font-family:'Geist Mono',monospace;font-size:56px;font-weight:400;letter-spacing:-.04em;line-height:.9;color:#C9F26B`,
                        )}
                      >
                        {s.num}
                      </span>
                      <div style={cssStyle(`display:flex;flex-direction:column;gap:10px`)}>
                        <div
                          style={cssStyle(`font-size:26px;font-weight:600;letter-spacing:-.025em`)}
                        >
                          {s.title}
                        </div>
                        <div
                          style={cssStyle(
                            `font-size:16px;line-height:1.55;color:rgba(255,255,255,.7)`,
                          )}
                        >
                          {s.copy}
                        </div>
                        <div
                          style={cssStyle(
                            `display:flex;gap:12px;align-items:center;margin-top:6px;font-size:15px`,
                          )}
                        >
                          <span
                            style={cssStyle(
                              `font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.08em;color:#0C1A15;background:#C9F26B;padding:5px 9px;border-radius:999px`,
                            )}
                          >
                            {"VÝSTUP"}
                          </span>
                          {s.output}
                        </div>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </section>
          <section style={cssStyle(`background:#fff;border-top:1px solid rgba(14,21,18,.12)`)}>
            <div
              style={cssStyle(
                `max-width:1280px;margin:0 auto;padding:88px 32px;box-sizing:border-box;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:56px`,
              )}
            >
              <div
                style={cssStyle(
                  `position:sticky;top:110px;align-self:start;background:#0C1A15;color:#fff;border-radius:28px;padding:32px;display:flex;flex-direction:column;gap:20px`,
                )}
              >
                <div
                  style={cssStyle(
                    `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#C9F26B`,
                  )}
                >
                  {"06 / ČASTÉ OTÁZKY"}
                </div>
                <h2
                  style={cssStyle(
                    `margin:0;font-size:clamp(32px,3.6vw,44px);line-height:1.04;letter-spacing:-.045em;font-weight:600`,
                  )}
                >
                  {"Dobré vedieť pred začiatkom."}
                </h2>
                <p
                  style={cssStyle(
                    `margin:0;font-size:16px;line-height:1.55;color:rgba(255,255,255,.72)`,
                  )}
                >
                  {
                    "Nenašli ste odpoveď? Napíšte alebo zavolajte — odpovedá priamo človek, ktorý riešenie navrhne."
                  }
                </p>
                <div
                  style={cssStyle(
                    `display:flex;align-items:center;gap:12px;padding:14px;border-radius:18px;background:rgba(255,255,255,.06)`,
                  )}
                >
                  <span
                    style={cssStyle(
                      `width:44px;height:44px;border-radius:50%;background:#C9F26B;color:#0C1A15;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:15px`,
                    )}
                  >
                    {"DV"}
                  </span>
                  <span style={cssStyle(`display:flex;flex-direction:column;gap:2px`)}>
                    <strong style={cssStyle(`font-size:15px;font-weight:600`)}>
                      {"Daniel Vendžúr"}
                    </strong>
                    <span style={cssStyle(`font-size:13px;color:rgba(255,255,255,.65)`)}>
                      {"zakladateľ a produktový dizajnér"}
                    </span>
                  </span>
                </div>
                <div style={cssStyle(`display:flex;gap:8px;flex-wrap:wrap`)}>
                  <a
                    href={sitePath("mailto:info@mojchatbot.sk")}
                    style={cssStyle(
                      `background:#C9F26B;color:#0C1A15;font-weight:600;font-size:14px;padding:12px 18px;border-radius:999px`,
                    )}
                  >
                    {"Napísať otázku →"}
                  </a>
                  <a
                    href={sitePath("tel:+421948699433")}
                    style={cssStyle(
                      `color:#fff;font-size:14px;padding:12px 18px;border-radius:999px;border:1px solid rgba(255,255,255,.25);font-family:'Geist Mono',monospace`,
                    )}
                  >
                    {"+421 948 699 433"}
                  </a>
                </div>
              </div>
              <div style={cssStyle(`display:flex;flex-direction:column;gap:10px`)}>
                {faqs.map((q, index) => (
                  <Fragment key={index}>
                    <details
                      style={cssStyle(
                        `background:#F5F4EF;border:1px solid rgba(14,21,18,.14);border-radius:18px`,
                      )}
                      className="ref-hover-10"
                    >
                      <summary
                        style={cssStyle(
                          `cursor:pointer;list-style:none;display:grid;grid-template-columns:44px minmax(0,1fr) 40px;gap:12px;align-items:center;padding:20px 20px 20px 24px;font-size:19px;font-weight:600;letter-spacing:-.01em`,
                        )}
                      >
                        <span
                          style={cssStyle(
                            `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#5C645F;font-weight:400`,
                          )}
                        >
                          {q.num}
                        </span>
                        {q.q}
                        <span
                          style={cssStyle(
                            `width:40px;height:40px;border-radius:50%;background:#0C1A15;color:#C9F26B;display:flex;align-items:center;justify-content:center;font-weight:400;font-size:20px`,
                          )}
                        >
                          {"+"}
                        </span>
                      </summary>
                      <p
                        style={cssStyle(
                          `margin:0;padding:0 24px 24px 80px;font-size:16px;line-height:1.6;color:#3F4743;max-width:640px`,
                        )}
                      >
                        {q.a}
                      </p>
                    </details>
                  </Fragment>
                ))}
              </div>
            </div>
          </section>
          <Footer />
        </div>
      </Fragment>
    );
  }
}
