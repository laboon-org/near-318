// FETCH ABI

// HELPER FUNCTIONS

// FETCH CHAIN DATA

// FETCH CSS
// NOTE: All CSS variables have moved to the gateway's "theme.css" file to avoid duplication in two places.

const Theme = styled.div``;

// Styled-Components
const MainFooterWrap = styled.div`
  background-color: #02042F;
  min-height: 168px;

  .container {
    margin: 1rem 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    .logo {
      width: 200px;
    }

    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 0.75rem;

      .network-info {
        margin: 0.8rem 0.625rem;

        .network-logo {
          width: 36px;
        }

        p {
          font-size: 1rem;
          color: #ffffff;
          font-weight: 300;
          font-size: 0.8rem;
        }

        button {
          padding: 0.8rem 1.2rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          white-space: nowrap;
          background-image: linear-gradient(51.86deg, #9F66B6 0%, #6C83EC 102.3%);
          color: #ffffff;

          small {
            font-size: 1.1rem;
          }

          i {
            margin-left: 0.5rem;
          }
        }
      }
    }

    .laboon {
      .laboon-info {
        display: flex;

        small {
          color: #ffffff;
          font-weight: 300;
          margin-left: 1rem;
          font-size: 12px;
        }
      }

      .laboon-logo {
        width: 80px;
        cursor: pointer;
      }
    }
  }
`;

// background: ${(props) => (props.primary ? "palevioletred" : "white")};
// OUTPUT UI
// className={`wrap ${styles["main-footer-wrap"]}`}
return (
  <Label.Root className="LabelRoot">
    <Theme>
      <MainFooterWrap className={`wrap`}>
        <div className={`wrap container`}>
          <div className={`item`}>
            <div className={`network-info`}>
              <div className={`network-logo`}>
                {/* <Image src={ICON_NETWORK} alt="Network" objectFit="contain" /> */}
              </div>
            </div>
            <div className={`network-info`}>
              {<p>Market Price: $1.00</p>}
              {/* {ratioStore.ratioUSD !== 0 && <p>Market Price: ${ratioStore.ratioUSD}</p>} */}
            </div>
            <div className={`network-info`}>
              <button type="button" className={`primary-btn`}>
                <small>Buy NEAR &nbsp;</small>
                <i>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                </i>
              </button>
            </div>
          </div>
          <div className={`item laboon`}>
            <div className={`laboon-logo laboon-info`}>
              <a target="_blank" href="https://laboon.org/">
                {/* <Image src={IMG_LABOON_LOGO} alt="Laboon" objectFit="contain" /> */}
              </a>
            </div>
            <div className={`laboon-info`}>
              <small>Developer by Laboon Team, Copyright © 2023</small>
              <a target="_blank" href="https://laboon.org/"></a>
            </div>
          </div>
        </div>
      </MainFooterWrap>
    </Theme>
  </Label.Root>
)
