import type { Wallet } from "@@types/types";

import { useCallback } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Blockchain, walletAddressDisplay } from "@coral-xyz/common";
import { ListItem, XStack } from "@coral-xyz/tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HardwareIcon, ImportedIcon, MnemonicIcon } from "~components/Icon";
import {
  CopyButtonIcon,
  ListRowSeparator,
  Margin,
  RoundedContainerGroup,
  Row,
  Screen,
  StyledText,
} from "~components/index";
import { getBlockchainLogo, useTheme } from "~hooks/index";
import { useWallets } from "~hooks/wallets";

function MainWalletListItem({
  publicKey,
  type,
  name,
  blockchain,
  onPress,
  balance,
}) {
  return (
    <ListItem
      hoverTheme
      pressTheme
      alignItems="center"
      paddingHorizontal={12}
      icon={<NetworkIcon size={18} blockchain={blockchain} />}
      onPress={() => onPress({ blockchain, name, publicKey, type })}
    >
      <XStack flex={1} justifyContent="space-between">
        <StyledText fontSize={16} fontWeight="600">
          {name}
        </StyledText>
        <StyledText fontSize={16} fontWeight="600">
          {balance}
        </StyledText>
      </XStack>
    </ListItem>
  );
}

export function MainWalletList({ onPressWallet }) {
  const { allWallets } = useWallets();
  return (
    <RoundedContainerGroup>
      <FlatList
        data={allWallets}
        keyExtractor={(item) => item.publicKey.toString()}
        renderItem={({ item: wallet }) => {
          return (
            <MainWalletListItem
              name={wallet.name}
              type={wallet.type}
              publicKey={wallet.publicKey}
              blockchain={wallet.blockchain}
              onPress={onPressWallet}
              balance="$4,197.67"
            />
          );
        }}
      />
    </RoundedContainerGroup>
  );
}

// NOTE(peter): copied from app-extension/src/components/common/WalletList.tsx
export function WalletListScreen({ navigation, route }): JSX.Element {
  const insets = useSafeAreaInsets();
  const { activeWallet, onSelectWallet, allWallets } = useWallets();

  const handlePressWallet = useCallback(
    (wallet: Wallet) => {
      onSelectWallet(wallet, () => {
        navigation.goBack();
      });
    },
    [onSelectWallet, navigation]
  );

  return (
    <Screen style={{ marginBottom: insets.bottom }}>
      <FlatList
        data={allWallets}
        ItemSeparatorComponent={() => <ListRowSeparator />}
        keyExtractor={(item) => item.publicKey.toString()}
        renderItem={({ item: wallet }) => {
          return (
            <WalletListItem
              name={wallet.name}
              publicKey={wallet.publicKey}
              type={wallet.type as string}
              blockchain={wallet.blockchain}
              onPress={handlePressWallet}
              icon={<CopyButtonIcon text={wallet.publicKey} />}
              isSelected={wallet.publicKey === activeWallet?.publicKey}
            />
          );
        }}
      />
    </Screen>
  );
}

function WalletListItem({
  blockchain,
  name,
  publicKey,
  type,
  icon,
  onPress,
  isSelected,
}: {
  blockchain: Blockchain;
  name: string;
  publicKey: string;
  type: string;
  icon?: JSX.Element | null;
  onPress: (wallet: Wallet) => void;
  isSelected: boolean;
}): JSX.Element {
  const theme = useTheme();
  return (
    <RoundedContainerGroup>
      <Pressable
        onPress={() => onPress({ blockchain, name, publicKey, type })}
        style={[
          styles.listItem,
          {
            backgroundColor: theme.custom.colors.nav,
          },
        ]}
      >
        <View style={styles.listItemLeft}>
          <Margin right={12}>
            <NetworkIcon blockchain={blockchain} />
          </Margin>
          <View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: isSelected
                  ? "Inter_600SemiBold"
                  : "Inter_400Regular",
                color: theme.custom.colors.fontColor,
              }}
            >
              {name}
            </Text>
            <Row>
              <WalletTypeIcon
                type={type}
                fill={isSelected ? theme.custom.colors.secondary : undefined}
              />
              <Text
                style={{ fontSize: 14, color: theme.custom.colors.fontColor }}
              >
                {walletAddressDisplay(publicKey)}
              </Text>
            </Row>
          </View>
        </View>
        {icon ? icon : null}
      </Pressable>
    </RoundedContainerGroup>
  );
}

function NetworkIcon({
  size,
  blockchain,
}: {
  size?: number;
  blockchain: Blockchain;
}) {
  const logo = getBlockchainLogo(blockchain);
  return (
    <Image
      style={[styles.logoContainer, { width: size, height: size }]}
      source={logo}
    />
  );
}

function WalletTypeIcon({ type, fill }: { type: string; fill?: string }) {
  switch (type) {
    case "imported":
      return <ImportedIcon fill={fill} />;
    case "hardware":
      return <HardwareIcon fill={fill} />;
    default:
      return <MnemonicIcon fill={fill} />;
  }
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
});
