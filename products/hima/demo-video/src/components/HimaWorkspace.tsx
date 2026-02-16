import React from "react";
import { FONT_FAMILY } from "../fonts";
import { DEMO_DATA_FILE_NAME, DEMO_DATA_PATH } from "../constants";
import { HimaBrand, HimaWorkspaceProps } from "../types";

export const HimaWorkspace: React.FC<HimaWorkspaceProps> = ({
  brand,
  recipeName,
  promptText = "",
  variablesDetected = [],
  csvLoaded = false,
  csvRowCount = 0,
  csvDragActive = false,
  mappings = [],
  csvPreviewData,
  batchProgress = 0,
  batchComplete = false,
  results = [],
  expandedRow,
  showExportDone = false,
  cursorPosition,
  showCursorHighlight = false,
  cursorHighlightOpacity = 0.22,
  disableCursorOverlay = false,
  realUiImage,
}) => {
  const showBatchButton =
    mappings.length > 0 && batchProgress === 0 && !batchComplete;

  if (realUiImage) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: brand.darkNavy,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={realUiImage}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center center",
            display: "block",
          }}
        />
        {cursorPosition && !disableCursorOverlay && (
          <>
            {showCursorHighlight && (
              <div
                style={{
                  position: "absolute",
                  left: cursorPosition.x - 20,
                  top: cursorPosition.y - 20,
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: `rgba(45,58,140,${cursorHighlightOpacity})`,
                  pointerEvents: "none",
                }}
              />
            )}
            <svg
              style={{
                position: "absolute",
                left: cursorPosition.x,
                top: cursorPosition.y,
                width: 16,
                height: 20,
                pointerEvents: "none",
                filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.3))",
              }}
              viewBox="0 0 16 20"
            >
              <path
                d="M0 0 L0 17 L4.5 12.5 L8 20 L10.5 19 L7 11.5 L13 11.5 Z"
                fill="#1A1A1A"
                stroke="#FFFFFF"
                strokeWidth="1"
              />
            </svg>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: FONT_FAMILY.body,
        backgroundColor: brand.offWhite,
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 48,
          backgroundColor: "#FFFFFF",
          borderBottom: `1px solid ${brand.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: brand.charcoal,
            letterSpacing: "-0.02em",
          }}
        >
          Hima
        </span>
        <span
          style={{
            fontSize: 12,
            color: brand.textSecondary,
            marginLeft: 8,
          }}
        >
          ワークスペース
        </span>
        <div style={{ flex: 1 }} />
        <div
          style={{
            fontSize: 11,
            color: brand.textSecondary,
            padding: "4px 10px",
            backgroundColor: "#F3F4F6",
            borderRadius: 6,
          }}
        >
          gpt-4o
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left panel: Recipe Editor */}
        <div
          style={{
            width: "45%",
            borderRight: `1px solid ${brand.border}`,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            backgroundColor: "#FFFFFF",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: brand.charcoal,
            }}
          >
            レシピエディタ
          </div>

          {/* Recipe name input (optional, used in 1-B) */}
          {recipeName !== undefined && (
            <div
              style={{
                border: `1px solid ${brand.border}`,
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 14,
                fontWeight: 600,
                color: brand.charcoal,
                backgroundColor: "#FAFAFA",
              }}
            >
              {recipeName ? (
                <>
                  {recipeName}
                  <span
                    style={{
                      display: "inline-block",
                      width: 2,
                      height: 16,
                      backgroundColor: brand.indigo,
                      marginLeft: 1,
                      verticalAlign: "middle",
                    }}
                  />
                </>
              ) : (
                <span style={{ color: "#D1D5DB" }}>レシピ名を入力...</span>
              )}
            </div>
          )}

          {/* Prompt input area */}
          <div
            style={{
              flex: 1,
              border: `1px solid ${brand.border}`,
              borderRadius: 8,
              padding: 14,
              fontSize: 13,
              lineHeight: 1.7,
              color: brand.charcoal,
              backgroundColor: "#FAFAFA",
              whiteSpace: "pre-wrap",
              position: "relative",
            }}
          >
            {promptText ? (
              <HighlightedPrompt text={promptText} brand={brand} />
            ) : (
              <span style={{ color: "#D1D5DB" }}>
                プロンプトを入力してください...
              </span>
            )}
            {promptText && (
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: 16,
                  backgroundColor: brand.indigo,
                  marginLeft: 1,
                }}
              />
            )}
          </div>

          {/* Detected variables */}
          {variablesDetected.length > 0 && (
            <div
              style={{
                padding: "10px 14px",
                backgroundColor: "#F0FDF9",
                borderRadius: 8,
                border: "1px solid #D1FAE5",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: brand.teal,
                  fontWeight: 600,
                }}
              >
                検出された変数:
              </span>
              {variablesDetected.map((v) => (
                <span
                  key={v}
                  style={{
                    fontSize: 12,
                    backgroundColor: "#ECFDF5",
                    color: brand.teal,
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontFamily: FONT_FAMILY.code,
                    fontWeight: 500,
                  }}
                >
                  {v}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right panel: Data input / Results */}
        <div
          style={{
            flex: 1,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            backgroundColor: "#FFFFFF",
          }}
        >
          {/* CSV drop zone */}
          {!csvLoaded && !batchProgress && results.length === 0 && (
            <CsvDropZone brand={brand} active={csvDragActive} />
          )}

          {/* CSV loaded confirmation */}
          {csvLoaded && mappings.length === 0 && !batchProgress && (
            <div
              style={{
                padding: 14,
                backgroundColor: "#F0FDF9",
                borderRadius: 8,
                fontSize: 13,
                color: brand.teal,
                border: "1px solid #D1FAE5",
                fontWeight: 500,
              }}
            >
              ✓ {DEMO_DATA_FILE_NAME}（{DEMO_DATA_PATH}） — {csvRowCount}件読み込み完了
            </div>
          )}

          {/* Mapping UI */}
          {mappings.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: brand.charcoal,
                }}
              >
                カラムマッピング
              </div>
              {mappings.map((m) => (
                <div
                  key={m.variable}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 13,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_FAMILY.code,
                      color: brand.indigo,
                      backgroundColor: "#EEF2FF",
                      padding: "4px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                    }}
                  >
                    {`{{${m.variable}}}`}
                  </span>
                  <span style={{ color: brand.textSecondary }}>→</span>
                  <span
                    style={{
                      padding: "4px 10px",
                      border: `1px solid ${brand.border}`,
                      borderRadius: 6,
                      backgroundColor: "#FAFAFA",
                      fontSize: 12,
                    }}
                  >
                    {m.column}
                  </span>
                </div>
              ))}
              <div
                style={{
                  fontSize: 12,
                  color: brand.textSecondary,
                  marginTop: 4,
                }}
              >
                入力件数: {csvRowCount}件
              </div>
            </div>
          )}

          {/* CSV preview data (optional, used in 1-B S2) */}
          {csvPreviewData && csvPreviewData.length > 0 && (
            <div
              style={{
                border: `1px solid ${brand.border}`,
                borderRadius: 8,
                overflow: "hidden",
                fontSize: 11,
              }}
            >
              <div
                style={{
                  display: "flex",
                  padding: "6px 10px",
                  backgroundColor: "#F9FAFB",
                  borderBottom: `1px solid ${brand.border}`,
                  fontWeight: 600,
                  color: brand.textSecondary,
                  gap: 8,
                }}
              >
                {csvPreviewData[0].map((h, i) => (
                  <div key={i} style={{ flex: 1 }}>
                    {h}
                  </div>
                ))}
              </div>
              {csvPreviewData.slice(1).map((row, ri) => (
                <div
                  key={ri}
                  style={{
                    display: "flex",
                    padding: "5px 10px",
                    borderBottom:
                      ri < csvPreviewData.length - 2
                        ? `1px solid ${brand.border}`
                        : "none",
                    color: brand.charcoal,
                    gap: 8,
                  }}
                >
                  {row.map((cell, ci) => (
                    <div
                      key={ci}
                      style={{
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Batch execute button - visible when mappings set, before execution */}
          {showBatchButton && (
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: brand.indigo,
                color: "#FFFFFF",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                alignSelf: "flex-start",
                boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
              }}
            >
              バッチ実行
            </button>
          )}

          {/* Batch execution area */}
          {(batchProgress > 0 || batchComplete) && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              {/* Progress bar */}
              <div
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 8,
                    backgroundColor: "#E5E7EB",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(batchProgress / 10) * 100}%`,
                      height: "100%",
                      backgroundColor: batchComplete
                        ? brand.teal
                        : brand.indigo,
                      borderRadius: 4,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: batchComplete ? brand.teal : brand.charcoal,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {batchProgress}/10 完了 ({(batchProgress / 10) * 100}%)
                </span>
              </div>
            </div>
          )}

          {/* Results table */}
          {results.length > 0 && (
            <div
              style={{
                flex: 1,
                border: `1px solid ${brand.border}`,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {/* Table header */}
              <div
                style={{
                  display: "flex",
                  padding: "8px 14px",
                  backgroundColor: "#F9FAFB",
                  borderBottom: `1px solid ${brand.border}`,
                  fontSize: 11,
                  fontWeight: 600,
                  color: brand.textSecondary,
                  gap: 10,
                }}
              >
                <div style={{ width: 30 }}>#</div>
                <div style={{ flex: 1 }}>商品名</div>
                <div style={{ width: 60, textAlign: "center" }}>
                  ステータス
                </div>
              </div>
              {/* Table rows */}
              {results.map((r, i) => (
                <React.Fragment key={i}>
                  <div
                    style={{
                      display: "flex",
                      padding: "8px 14px",
                      borderBottom: `1px solid ${brand.border}`,
                      fontSize: 12,
                      color: brand.charcoal,
                      gap: 10,
                      backgroundColor:
                        expandedRow === i ? "#F9FAFB" : "#FFFFFF",
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        color: brand.textSecondary,
                        fontSize: 11,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, fontSize: 12 }}>{r.name}</div>
                    <div
                      style={{
                        width: 60,
                        textAlign: "center",
                        fontSize: 12,
                      }}
                    >
                      {r.status}
                    </div>
                  </div>
                  {expandedRow === i && (
                    <div
                      style={{
                        padding: "10px 14px 10px 54px",
                        backgroundColor: "#F9FAFB",
                        borderBottom: `1px solid ${brand.border}`,
                        fontSize: 12,
                        lineHeight: 1.6,
                        color: brand.charcoal,
                      }}
                    >
                      {r.text}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Export button */}
          {batchComplete && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              {showExportDone && (
                <span
                  style={{
                    fontSize: 12,
                    color: brand.teal,
                    padding: "8px 0",
                    fontWeight: 500,
                  }}
                >
                  ✓ エクスポート完了
                </span>
              )}
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: showExportDone
                    ? "#D1FAE5"
                    : brand.charcoal,
                  color: showExportDone ? brand.teal : "#FFFFFF",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                CSV エクスポート
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cursor overlay — disabled when using real UI shots (dark theme) */}
      {cursorPosition && !disableCursorOverlay && (
        <>
          {showCursorHighlight && (
            <div
              style={{
                position: "absolute",
                left: cursorPosition.x - 20,
                top: cursorPosition.y - 20,
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: `rgba(45,58,140,${cursorHighlightOpacity})`,
                pointerEvents: "none",
              }}
            />
          )}
          <svg
            style={{
              position: "absolute",
              left: cursorPosition.x,
              top: cursorPosition.y,
              width: 16,
              height: 20,
              pointerEvents: "none",
              filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.3))",
            }}
            viewBox="0 0 16 20"
          >
            <path
              d="M0 0 L0 17 L4.5 12.5 L8 20 L10.5 19 L7 11.5 L13 11.5 Z"
              fill="#1A1A1A"
              stroke="#FFFFFF"
              strokeWidth="1"
            />
          </svg>
        </>
      )}
    </div>
  );
};

const HighlightedPrompt: React.FC<{ text: string; brand: HimaBrand }> = ({
  text,
  brand,
}) => {
  const parts = text.split(/({{[^}]+}})/);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("{{") ? (
          <span
            key={i}
            style={{
              backgroundColor: "#EEF2FF",
              color: brand.indigo,
              padding: "1px 4px",
              borderRadius: 3,
              fontFamily: FONT_FAMILY.code,
              fontSize: 12,
            }}
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

const CsvDropZone: React.FC<{ brand: HimaBrand; active?: boolean }> = ({
  brand,
  active,
}) => (
  <div
    style={{
      flex: 1,
      border: `2px dashed ${active ? brand.indigo : brand.border}`,
      borderRadius: 12,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      color: active ? brand.indigo : brand.textSecondary,
      backgroundColor: active ? "rgba(45,58,140,0.04)" : "transparent",
    }}
  >
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? brand.indigo : "#9CA3AF"}
      strokeWidth="1.5"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
    <span style={{ fontSize: 13 }}>CSVファイルをドロップ</span>
    <span style={{ fontSize: 11 }}>またはクリックして選択</span>
  </div>
);
