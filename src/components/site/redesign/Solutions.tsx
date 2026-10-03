import React, { Component, Fragment } from "react";
import { cssStyle, sitePath } from "./utils";
import { Footer } from "./Footer";

export class Solutions extends Component<{
  active?: string;
  title?: string;
  copy?: string;
  tool?: string;
}> {
  state = { mode: "chatbot" };
  renderVals() {
    const P = "/work/";
    const F: Record<string, { label: string; s: string[][] }> = {
      chatbot: {
        label: "Chatbot",
        s: [
          [
            "OTÁZKA",
            "Zákazník sa pýta na produkt alebo nákup.",
            "Namiesto hľadania medzi desiatkami stránok sa opýta priamo na webe.",
            "Ktorý produkt je pre mňa vhodný?",
          ],
          [
            "POTREBY",
            "Chatbot zistí, čo zákazník skutočne hľadá.",
            "Doplní použitie, preferencie, rozpočet alebo parametre.",
            "Použitie / preferencie / rozpočet",
          ],
          [
            "ODPORÚČANIE",
            "Zúži ponuku na relevantné produkty.",
            "Ukáže vhodné možnosti a vysvetlí rozdiely.",
            "2–3 vhodné produkty + rozdiely",
          ],
          [
            "NÁKUP",
            "Zákazník pokračuje k produktu alebo do košíka.",
            "Rozhodnutie sa nestratí v ďalšom formulári.",
            "Produkt / košík / nákup",
          ],
        ],
      },
      calc: {
        label: "Kalkulačka",
        s: [
          [
            "ZAČIATOK",
            "Návštevník chce poznať cenu.",
            "Výpočet začne hneď, bez telefonátu alebo čakania.",
            "Koľko to bude približne stáť?",
          ],
          [
            "ÚDAJE",
            "Zadá niekoľko jednoduchých údajov.",
            "Vyberie rozmer, množstvo, variant alebo doplnky.",
            "Rozmer / množstvo / variant",
          ],
          [
            "VÝPOČET",
            "Web cenu prepočíta.",
            "Použije váš cenník a pravidlá, ktoré už vo firme máte.",
            "Vaše pravidlá + váš cenník",
          ],
          [
            "VÝSLEDOK",
            "Ukáže výsledok a ďalší krok.",
            "Návštevník vie, s čím počítať, a môže odoslať dopyt.",
            "Odhad ceny + pripravený dopyt",
          ],
        ],
      },
      conf: {
        label: "Konfigurátor",
        s: [
          [
            "VÝBER",
            "Návštevník si vyberie, čo hľadá.",
            "Začne jednoduchou voľbou namiesto preklikávania ponuky.",
            "Čo potrebujem?",
          ],
          [
            "MOŽNOSTI",
            "Web ukáže vhodné možnosti.",
            "Rozmery, modely, farby a doplnky v správnom poradí.",
            "Len možnosti, ktoré viete dodať",
          ],
          [
            "KONTROLA",
            "Skontroluje celý výber.",
            "Nedovolí kombináciu, ktorú neviete dodať alebo vyrobiť.",
            "Kontrola kombinácií",
          ],
          [
            "ZOSTAVA",
            "Hotovú zostavu odošle vám.",
            "Spolu s kontaktom dostanete presný výber návštevníka.",
            "Zostava + kontakt",
          ],
        ],
      },
      all: {
        label: "Všetko spolu",
        s: [
          [
            "OTÁZKA",
            "Chatbot odpovie a zistí, čo zákazník hľadá.",
            "Poradí z vašich podkladov a pozná rozmer, použitie aj rozpočet.",
            "Chatbot + vaše podklady",
          ],
          [
            "VÝBER",
            "Poradca alebo konfigurátor zúži ponuku.",
            "Zákazník si vyberie produkt alebo poskladá zostavu — aj v 3D.",
            "Poradca / 3D konfigurátor",
          ],
          [
            "CENA",
            "Kalkulačka spočíta cenu celej zostavy.",
            "S montážou, dopravou aj doplnkami podľa vášho cenníka.",
            "Kalkulačka + váš cenník",
          ],
          [
            "DOPYT",
            "Všetko príde naraz v jednom dopyte.",
            "Otázky, výber, zostava, cena aj kontakt.",
            "Jeden kompletný dopyt",
          ],
        ],
      },
    };
    const m = this.state.mode;
    return {
      tools: [
        {
          verb: "Opýtať sa",
          name: "Chatbot",
          price: "od 347 €",
          customer: "Dostane odpoveď a jasný ďalší krok bez hľadania po webe.",
          business: "Dostane kontakt spolu s kontextom.",
          img: P + "solutions/chatbot-aplan.webp",
          w: "56%",
          href: "/nastroj?t=chatbot",
        },
        {
          verb: "Zistiť cenu",
          name: "Kalkulačka",
          price: "od 447 €",
          customer: "Vidí orientačnú cenu ešte pred kontaktovaním firmy.",
          business: "Dostane vstupy aj výsledok pripravený pre ponuku.",
          img: P + "solutions/kalkulacka-derat.webp",
          w: "68%",
          href: "/nastroj?t=kalkulacka",
        },
        {
          verb: "Poskladať produkt",
          name: "Konfigurátor (aj 3D)",
          price: "od 447 €",
          customer: "Poskladá si variant, rozmery, materiál alebo doplnky.",
          business: "Dostane hotovú špecifikáciu namiesto neúplného formulára.",
          img: P + "koverta/konfigurator-pergola.webp",
          w: "100%",
          href: "/3d-konfigurator",
        },
        {
          verb: "Vybrať produkt",
          name: "Produktový poradca",
          price: "od 347 €",
          customer: "Rýchlejšie sa dostane k produktu, ktorý mu dáva zmysel.",
          business: "Asistovaný výber bez poznania celého katalógu.",
          img: P + "solutions/poradca-kava.webp",
          w: "56%",
          href: "/nastroj?t=poradca",
        },
      ].map((t, i) => ({ ...t, num: "0" + (i + 1) })),
      modes: Object.keys(F).map((k) => ({
        label: F[k].label,
        bg: k === m ? "#fff" : "transparent",
        color: k === m ? "#0C1A15" : "rgba(255,255,255,.75)",
        pick: () => this.setState({ mode: k }),
      })),
      stages: F[m].s.map(([label, title, copy, artifact]: string[], i: number) => ({
        index: "0" + (i + 1),
        label,
        title,
        copy,
        artifact,
      })),
      audiences: [
        {
          index: "01 / SLUŽBY",
          title: "Firmy so službami",
          copy: "Keď cenu alebo zadanie nemožno vyriešiť jedným statickým formulárom. Pomôže kalkulačka, krátky krokový konfigurátor alebo chatbot, ktorý zozbiera presné podklady.",
          tags: [
            "orientačný výpočet",
            "presné zadanie dopytu",
            "výber variantu služby",
            "vysvetlenie možností",
          ],
          bg: "#0C1A15",
          fg: "#fff",
          muted: "rgba(255,255,255,.72)",
          line: "rgba(255,255,255,.18)",
          accent: "#C9F26B",
        },
        {
          index: "02 / E-SHOPY",
          title: "E-shopy",
          copy: "Keď má zákazník veľa produktov, parametrov alebo variantov a nevie, ktorý zvoliť. Najčastejšie pomôže produktový poradca alebo riadený výber.",
          tags: [
            "produktový poradca",
            "kompatibilný variant",
            "produktové otázky",
            "prechod na produkt",
          ],
          bg: "#fff",
          fg: "#0E1512",
          muted: "#5C645F",
          line: "rgba(14,21,18,.14)",
          accent: "#5C645F",
        },
      ],
    };
  }
  render() {
    const { audiences, modes, stages, tools } = this.renderVals();
    return (
      <Fragment>
        <div
          style={cssStyle(
            `font-family:'Geist',system-ui,sans-serif;color:#0E1512;background:#F5F4EF`,
          )}
        >
          <div style={cssStyle(`position:sticky;top:0;z-index:50`)}></div>
          <section
            style={cssStyle(
              `max-width:1280px;margin:0 auto;padding:64px 32px 72px;box-sizing:border-box`,
            )}
          >
            <div
              style={cssStyle(
                `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#5C645F;padding-bottom:20px;border-bottom:1px solid rgba(14,21,18,.12)`,
              )}
            >
              <a href={sitePath("/")}>{"DOMOV"}</a>
              {" / RIEŠENIA"}
            </div>
            <div
              style={cssStyle(
                `display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr));gap:24px 56px;align-items:end;padding-top:48px`,
              )}
            >
              <h1
                style={cssStyle(
                  `margin:0;font-size:clamp(52px,7vw,96px);line-height:.92;letter-spacing:-.055em;font-weight:600`,
                )}
              >
                {"Nástroje, ktoré posunú zákazníka "}
                <span style={cssStyle(`color:#1F5B47`)}>{"k výsledku."}</span>
              </h1>
              <p
                style={cssStyle(
                  `margin:0;font-size:18px;line-height:1.5;color:#5C645F;text-wrap:pretty`,
                )}
              >
                {
                  "Nezačíname technológiou. Najprv určujeme, čo má človek na vašom webe zistiť, vypočítať, vybrať alebo odoslať."
                }
              </p>
            </div>
          </section>
          <section
            style={cssStyle(
              `background:#fff;border-top:1px solid rgba(14,21,18,.12);border-bottom:1px solid rgba(14,21,18,.12)`,
            )}
          >
            <div
              style={cssStyle(
                `max-width:1280px;margin:0 auto;padding:72px 32px 88px;box-sizing:border-box;display:flex;flex-direction:column;gap:36px`,
              )}
            >
              <div
                style={cssStyle(
                  `display:flex;justify-content:space-between;align-items:end;gap:24px 32px;flex-wrap:wrap`,
                )}
              >
                <div>
                  <div
                    style={cssStyle(
                      `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#5C645F`,
                    )}
                  >
                    {"01 / NÁSTROJE"}
                  </div>
                  <h2
                    style={cssStyle(
                      `margin:16px 0 0;font-size:clamp(36px,4.5vw,56px);line-height:1.04;letter-spacing:-.045em;font-weight:600`,
                    )}
                  >
                    {"Čo má zákazník"}
                    <br />
                    {"na webe urobiť?"}
                  </h2>
                </div>
                <p
                  style={cssStyle(
                    `margin:0;font-size:17px;line-height:1.5;color:#5C645F;max-width:400px`,
                  )}
                >
                  {
                    "Každý nástroj rieši iné rozhodnutie. Keď to dáva zmysel, spojíme ich do jedného rozhrania."
                  }
                </p>
              </div>
              <div
                style={cssStyle(
                  `display:flex;flex-direction:column;border-top:1px solid rgba(14,21,18,.12)`,
                )}
              >
                {tools.map((t, index) => (
                  <Fragment key={index}>
                    <a
                      href={sitePath(t.href)}
                      data-cursor={"Viac"}
                      style={cssStyle(
                        `display:grid;grid-template-columns:48px minmax(0,1.15fr) minmax(0,1fr) 150px 44px;gap:24px;align-items:center;padding:24px 12px;border-bottom:1px solid rgba(14,21,18,.12);border-radius:4px`,
                      )}
                      className="ref-hover-11"
                    >
                      <span
                        style={cssStyle(
                          `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#5C645F`,
                        )}
                      >
                        {t.num}
                      </span>
                      <span style={cssStyle(`display:flex;flex-direction:column;gap:6px`)}>
                        <span
                          style={cssStyle(
                            `font-size:38px;font-weight:600;letter-spacing:-.04em;line-height:1.04`,
                          )}
                        >
                          {t.verb}
                        </span>
                        <span style={cssStyle(`font-size:16px;font-weight:600`)}>
                          {t.name}
                          {" · "}
                          <span
                            style={cssStyle(
                              `font-family:'Geist Mono',monospace;font-size:13px;font-weight:400;color:#5C645F`,
                            )}
                          >
                            {t.price}
                          </span>
                        </span>
                      </span>
                      <span
                        style={cssStyle(
                          `display:flex;flex-direction:column;gap:10px;font-size:14px;line-height:1.45`,
                        )}
                      >
                        <span>
                          <span
                            style={cssStyle(
                              `font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.08em;color:#1F5B47`,
                            )}
                          >
                            {"ZÁKAZNÍK · "}
                          </span>
                          {t.customer}
                        </span>
                        <span>
                          <span
                            style={cssStyle(
                              `font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.08em;color:#1F5B47`,
                            )}
                          >
                            {"FIRMA · "}
                          </span>
                          {t.business}
                        </span>
                      </span>
                      <span
                        style={cssStyle(
                          `height:96px;border-radius:12px;background:#ECEAE3;overflow:hidden;display:flex;justify-content:center`,
                        )}
                      >
                        <img
                          src={sitePath(t.img)}
                          alt={""}
                          style={cssStyle(
                            `width:${t.w};margin-top:10px;border-radius:6px;align-self:flex-start`,
                          )}
                          loading="lazy"
                        />
                      </span>
                      <span
                        style={cssStyle(
                          `width:44px;height:44px;border-radius:50%;border:1px solid rgba(14,21,18,.2);display:flex;align-items:center;justify-content:center`,
                        )}
                      >
                        {"↗"}
                      </span>
                    </a>
                  </Fragment>
                ))}
              </div>
            </div>
          </section>
          <section style={cssStyle(`background:#0C1A15;color:#fff`)}>
            <div
              style={cssStyle(
                `max-width:1280px;margin:0 auto;padding:88px 32px;box-sizing:border-box;display:flex;flex-direction:column;gap:36px`,
              )}
            >
              <div
                style={cssStyle(
                  `display:flex;justify-content:space-between;align-items:end;gap:24px 32px;flex-wrap:wrap;padding-top:28px;border-top:1px solid rgba(255,255,255,.12)`,
                )}
              >
                <div>
                  <div
                    style={cssStyle(
                      `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#C9F26B`,
                    )}
                  >
                    {"02 / CESTA ZÁKAZNÍKA"}
                  </div>
                  <h2
                    style={cssStyle(
                      `margin:16px 0 0;font-size:clamp(36px,4.5vw,56px);line-height:1.04;letter-spacing:-.045em;font-weight:600`,
                    )}
                  >
                    {"Od otázky k výsledku."}
                  </h2>
                </div>
                <div
                  style={cssStyle(
                    `display:flex;gap:4px;background:rgba(255,255,255,.06);padding:5px;border-radius:999px;flex-wrap:wrap`,
                  )}
                >
                  {modes.map((m, index) => (
                    <Fragment key={index}>
                      <button
                        onClick={m.pick}
                        style={cssStyle(
                          `all:unset;cursor:pointer;padding:10px 18px;border-radius:999px;font-size:14px;background:${m.bg};color:${m.color}`,
                        )}
                        type="button"
                      >
                        {m.label}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div
                style={cssStyle(
                  `display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px`,
                )}
              >
                {stages.map(
                  (
                    s: {
                      index: string;
                      label: string;
                      title: string;
                      copy: string;
                      artifact: string;
                    },
                    index: number,
                  ) => (
                    <Fragment key={index}>
                      <div
                        style={cssStyle(
                          `background:#13261F;border:1px solid rgba(255,255,255,.08);border-radius:24px;padding:26px;display:flex;flex-direction:column;gap:12px`,
                        )}
                      >
                        <div
                          style={cssStyle(
                            `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#C9F26B`,
                          )}
                        >
                          {s.index}
                          {" / "}
                          {s.label}
                        </div>
                        <div
                          style={cssStyle(
                            `font-size:20px;font-weight:600;letter-spacing:-.02em;line-height:1.2`,
                          )}
                        >
                          {s.title}
                        </div>
                        <div
                          style={cssStyle(
                            `font-size:15px;line-height:1.5;color:rgba(255,255,255,.7)`,
                          )}
                        >
                          {s.copy}
                        </div>
                        <div
                          style={cssStyle(
                            `margin-top:auto;padding-top:14px;border-top:1px solid rgba(255,255,255,.12);font-size:14px;font-weight:500`,
                          )}
                        >
                          {s.artifact}
                        </div>
                      </div>
                    </Fragment>
                  ),
                )}
              </div>
            </div>
          </section>
          <section
            style={cssStyle(
              `max-width:1280px;margin:0 auto;padding:88px 32px;box-sizing:border-box;display:flex;flex-direction:column;gap:36px`,
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
                  {"03 / PRE KOHO"}
                </div>
                <h2
                  style={cssStyle(
                    `margin:16px 0 0;font-size:clamp(36px,4.5vw,56px);line-height:1.04;letter-spacing:-.045em;font-weight:600`,
                  )}
                >
                  {"Iný problém pri službách."}
                  <br />
                  {"Iný pri e-shope."}
                </h2>
              </div>
            </div>
            <div
              style={cssStyle(
                `display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:12px`,
              )}
            >
              {audiences.map((a, index) => (
                <Fragment key={index}>
                  <div
                    style={cssStyle(
                      `background:${a.bg};color:${a.fg};border:1px solid ${a.line};border-radius:28px;padding:36px;display:flex;flex-direction:column;gap:18px`,
                    )}
                  >
                    <div
                      style={cssStyle(
                        `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:${a.accent}`,
                      )}
                    >
                      {a.index}
                    </div>
                    <h3
                      style={cssStyle(
                        `margin:0;font-size:34px;font-weight:600;letter-spacing:-.035em;line-height:1.04`,
                      )}
                    >
                      {a.title}
                    </h3>
                    <p
                      style={cssStyle(`margin:0;font-size:16px;line-height:1.55;color:${a.muted}`)}
                    >
                      {a.copy}
                    </p>
                    <div style={cssStyle(`display:flex;gap:8px;flex-wrap:wrap`)}>
                      {a.tags.map((tg, index) => (
                        <Fragment key={index}>
                          <span
                            style={cssStyle(
                              `border:1px solid ${a.line};padding:8px 12px;border-radius:999px;font-size:13px`,
                            )}
                          >
                            {tg}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </section>
          <Footer
            title={"Neviete, čo sa hodí práve vám?"}
            copy={
              "Stručne opíšte, čo dnes zákazníkom vysvetľujete, počítate alebo vyberáte. Navrhneme najjednoduchší funkčný smer."
            }
          />
        </div>
      </Fragment>
    );
  }
}
