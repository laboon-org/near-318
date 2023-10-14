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
`;
const Container = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;
const Item = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.75rem;
`;
const NetworkInfo = styled.div`
  margin: 0.8rem 0.625rem;
`;
const NetworkLogo = styled.div`
  width: 36px;
`;
const ButtonPrimary = styled.div`
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  background-image: linear-gradient(51.86deg, #9F66B6 0%, #6C83EC 102.3%);
  color: #ffffff;
`;
const LaboonInfo = styled.div`
  display: flex;
`;

// HTML Styled-Components
const HTML_P = styled.div`
  font-size: 1rem;
  color: #ffffff;
  font-weight: 300;
  font-size: 0.8rem;
`;
const HTML_Small = styled.div`
  font-size: 1.1rem;
`;
const HTML_Small2 = styled.div`
  color: #ffffff;
  font-weight: 300;
  margin-left: 1rem;
  font-size: 12px;
`;
const HTML_I = styled.div`
  margin-left: 0.5rem;
`;

// background: ${(props) => (props.primary ? "palevioletred" : "white")};

// OUTPUT UI
// className={`wrap ${styles["main-footer-wrap"]}`}
//
return (
  <Label.Root className="LabelRoot">
    <Theme>
      <MainFooterWrap className={`wrap`}>
        <Container className={`wrap`}>
          <Item>
            <NetworkInfo>
              <NetworkLogo>
                {/* <Image src={ICON_NETWORK} alt="Network" objectFit="contain" /> */}
              </NetworkLogo>
            </NetworkInfo>
            <NetworkInfo>
              {<HTML_P>Market Price: $1.00</HTML_P>}
              {/* {ratioStore.ratioUSD !== 0 && <p>Market Price: ${ratioStore.ratioUSD}</p>} */}
            </NetworkInfo>
            <NetworkInfo>
              <ButtonPrimary>
                <HTML_Small>Buy NEAR&nbsp;</HTML_Small>
                <HTML_I>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                </HTML_I>
              </ButtonPrimary>
            </NetworkInfo>
          </Item>
          <Item className={`laboon`}>
            <LaboonInfo className={`laboon-logo`}>
              <a target="_blank" href="https://laboon.org/">
                {/* <Image src={IMG_LABOON_LOGO} alt="Laboon" objectFit="contain" /> */}
              </a>
            </LaboonInfo>
            <LaboonInfo>
              <HTML_Small2>Developer by Laboon Team, Copyright © 2023</HTML_Small2>
              <a target="_blank" href="https://laboon.org/"></a>
            </LaboonInfo>
          </Item>
        </Container>
      </MainFooterWrap>
    </Theme>
  </Label.Root>
)
